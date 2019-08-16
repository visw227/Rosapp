//******************************************************************************
// djohnson - 3/11/2019
// abandonded fetch wrapper - XmlHttpRequest provides a timeout 
//******************************************************************************

import { Config } from '../Helpers/Config';
import { withCacheBustingTimestamp } from '../Helpers/WithCacheBustingTimestamp';

import { Logger } from '../Helpers/Logger';
import { Utils } from '../Helpers/Utils';

import NavigationService from '../Helpers/NavigationService';


var lastUrl = "";


export function serviceWrapper(url, method, jsonBody, subDomain, token, redirect_on_401, callback) {

    // just so we can see API requests happeing easier...
    //console.log("----------------------- SERVICE WRAPPER -----------------------")

    let fullUrl = ''
    let protocol = ''

    let config = Config.Environment()

    fullUrl = config.DOMAIN_PROTOCOL + subDomain + "." + config.DOMAIN + url

    // tack on timestamp as a cache buster
    fullUrl = withCacheBustingTimestamp(fullUrl)


    console.log("fullUrl", fullUrl)
    //console.log(method, jsonBody)

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

    xhr.timeout = 15000; // time in milliseconds

    // Setup our listener to process compeleted requests
    xhr.onerror = function(err) {
        //console.log("error", err)
    }
    xhr.onloadstart = function() {
        //console.log("onloadstart")
    }
    xhr.onprogress = function() {
        //console.log("onprogress")
    }
    xhr.onabort = function() {
        //console.log("abort")
    }
    xhr.ontimeout = function() {
        //console.log("the request timed out")

        //Logger.LogEvent(false, "API (TIMED OUT)", url, { request: logRequest })

    }
    xhr.onreadystatechange = function() {

        //console.log("xhr.onreadstatechange", xhr)

        // Only run if the request is complete
        if (xhr.readyState !== 4) return;

        // Process our return data
        if (xhr.status === 200) {

            let json = JSON.parse(xhr.response)


            // if(xhr._url.indexOf('api/ManagerAppAlertMethods/unOpenedAlerts') == -1) {
            //     console.log("************************************* ServiceWrapper - 200 ***********************************************")
            //     console.log("url", xhr._url)
            //     console.log("xhr", xhr) //JSON.stringify(xhr, null, 2))
            //     console.log("xhr.response", json)
            // }
            
            //Logger.LogEvent(true, "API (200)", url, { request: logRequest, response: json })

            // 200 successes can return errors - e.g. { Success: false, ErrorMsg: "Login attempt failed 5 times. Account is now locked." }
            if(json.ErrorMsg) {

                //Logger.LogEvent(false, "API (200 with ERROR)", url, { request: logRequest, response: json })

                callback( { status: xhr.status, message: json.ErrorMsg }, null)
            }
            else {
                callback(null, json)
            }


        } 
        else if (xhr.status === 401) {

            let message = xhr._response

            // the user's token has expired
            // TRY to find out why the we keep seeing the login screen so much
            // console.log("************************************* ServiceWrapper - 401 ***********************************************")
            // console.log("url", xhr._url)
            // console.log("xhr", xhr)

            callback({ status: xhr.status, message: message }, null)


            //Logger.LogEvent(false, "API (401)", url, { request: logRequest, response: xhr._response })

            // exclude some 401s from causing a redirect to login
            if(redirect_on_401) {
                // force the user to the login screen
                NavigationService.navigate('LoginStack')
            }

        } 
        else {

            // BE AWARE - PC4 responses are VERY unpredictable
            // They can be text strings, HTML, or a JSON object... have fun
           

            // console.log("************************************* ServiceWrapper - " + xhr.status + " ***********************************************")
            // console.log("url", xhr._url)
            // console.log("xhr._response", xhr._response)

            let message = xhr._response

            if(message.indexOf('<html') !== -1) {

                console.log("error is HTML", message)
                message = "We're sorry, but an unexpected error occurred while processing your request."
            }
            else if(message.indexOf('{') !== -1) {

                console.log("error is JSON", JSON.stringify(json, null, 2))

                let json = JSON.parse(message)


                message = (json.Message || "") + " " + (json.ExceptionMessage || "")

            }
            else {

                //console.log("error MAY just be a string", message)

                // strip out any extra quotes from response - e.g. _response: ""The email address is not associated with any sites""
                message = Utils.ReplaceAll(message, '"', '')

            }



            // What to do when the request has failed
            //console.log('something went wrong', xhr);
            callback({ status: xhr.status, message: message }, null)


            //Logger.LogEvent(false, "API (" + xhr.status.toString() + ")", url, { request: logRequest, response: message })

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