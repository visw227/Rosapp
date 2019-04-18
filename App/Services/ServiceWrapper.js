//******************************************************************************
// djohnson - 3/11/2019
// abandonded fetch wrapper - XmlHttpRequest provides a timeout 
//******************************************************************************

import config from '../app-config.json'
import { withCacheBustingTimestamp } from '../Helpers/WithCacheBustingTimestamp';

import { Logger } from '../Helpers/Logger';
import { Utils } from '../Helpers/Utils';

import NavigationService from '../Helpers/NavigationService';


var lastUrl = "";

export function serviceWrapper(url, method, jsonBody, subDomain, token, callback) {


    let fullUrl = ''
    let protocol = ''

    console.log("starting request", url, method, jsonBody, subDomain, token)


    // clear everything on login
    // if(url.toLowerCase().indexOf("/login") !== -1) {
    //     Logger.DeleteAllEvents()
    // }

 

    // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
    if (config.DOMAIN.indexOf('rosnet') !== -1) {
        protocol = "https://"
    } else {
        protocol = "http://"
    }

    fullUrl = protocol + subDomain + "." + config.DOMAIN + url

    // tack on timestamp as a cache buster
    fullUrl = withCacheBustingTimestamp(fullUrl)

    console.log("fullUrl", fullUrl)


    //Logger.LogEvent(true, "ServiceWrapper", "Starting request", { url: fullUrl, method: method })

    // just for logging
    let logRequest = {
        url: fullUrl,
        headers: { 
            managerAppToken: token
        },
        method: method,
        body: jsonBody
    }

    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    xhr.timeout = 5000; // time in milliseconds

    // Setup our listener to process compeleted requests
    xhr.onerror = function(err) {
        console.log("error", err)
    }
    xhr.onloadstart = function() {
        console.log("onloadstart")
    }
    xhr.onprogress = function() {
        console.log("onprogress")
    }
    xhr.onabort = function() {
        console.log("abort")
    }
    xhr.ontimeout = function() {
        console.log("the request timed out")

        Logger.LogEvent(false, "API (TIMED OUT)", url, { request: logRequest })

    }
    xhr.onreadystatechange = function() {

        //console.log("xhr.onreadstatechange", xhr)

        // Only run if the request is complete
        if (xhr.readyState !== 4) return;

        // Process our return data
        if (xhr.status === 200) {

            let json = JSON.parse(xhr.response)

            console.log("xhr.response", json)

            Logger.LogEvent(true, "API (200)", url, { request: logRequest, response: json })

            // 200 successes can return errors - e.g. { Success: false, ErrorMsg: "Login attempt failed 5 times. Account is now locked." }
            if(json.ErrorMsg) {

                Logger.LogEvent(false, "API (200 with ERROR)", url, { request: logRequest, response: json })

                callback( { status: xhr.status, message: json.ErrorMsg }, null)
            }
            else {
                callback(null, json)
            }


        } 
        else if (xhr.status === 401) {

            let message = xhr._response

            // the user's token has expired
            console.log(">>> the user request was unauthorized")
            console.log("xhr.response", xhr._response)

            callback({ status: xhr.status, message: message }, null)


            Logger.LogEvent(false, "API (401)", url, { request: logRequest, response: xhr._response })

            // force the user to the login screen
            NavigationService.navigate('LoginStack');

        } 
        else {

            // BE AWARE - PC4 responses are VERY unpredictable
            // They can be text strings, HTML, or a JSON object... have fun

            console.log("xhr._response", xhr._response)
            let message = xhr._response

            if(message.indexOf('{') !== -1) {

                console.log("error is JSON", JSON.stringify(json, null, 2))

                let json = JSON.parse(message)


                message = (json.Message || "") + " " + (json.ExceptionMessage || "")
            }
            else if(message.indexOf('<') !== -1) {

                console.log("error is HTML", message)
                message = "An error occurred, but the response was HTML so unable to parse."
            }
            else {

                console.log("error MAY just be a string", message)

                // strip out any extra quotes from response - e.g. _response: ""The email address is not associated with any sites""
                message = Utils.ReplaceAll(message, '"', '')

            }



            // What to do when the request has failed
            console.log('something went wrong', xhr);
            callback({ status: xhr.status, message: message }, null)


            Logger.LogEvent(false, "API (" + xhr.status.toString() + ")", url, { request: logRequest, response: message })

        }

    };

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    xhr.open(method, fullUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    if (token) {
        xhr.setRequestHeader("managerAppToken", token);
    }
    // send the request
    if (jsonBody && (method === 'POST' || method === 'PUT')) {
        xhr.send(JSON.stringify(jsonBody));
    } else {
        xhr.send(); // GET
    }

}