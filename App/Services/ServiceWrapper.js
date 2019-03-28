//******************************************************************************
// djohnson - 3/11/2019
// abandonded fetch wrapper - XmlHttpRequest provides a timeout 
//******************************************************************************

import config from '../app-config.json'
import { withCacheBustingTimestamp } from '../Helpers/WithCacheBustingTimestamp';


export function serviceWrapper(url, method, jsonBody, subDomain, token, callback) {


    let fullUrl = ''
    let protocol = ''

    console.log("starting request", url, method, jsonBody, subDomain, token)

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

    }
    xhr.onreadystatechange = function() {

        //console.log("xhr.onreadstatechange", xhr)

        // Only run if the request is complete
        if (xhr.readyState !== 4) return;

        // Process our return data
        if (xhr.status === 200) {

            // var isValidJSON = true;
            // try { 
            //   JSON.parse(xhr.response) 
            // }
            // catch(e) { 
            //   isValidJSON = false 
            // }

            let json = JSON.parse(xhr.response)

            console.log("xhr.response", JSON.stringify(json, null, 2))

            // 200 successes can return errors - e.g. { Success: false, ErrorMsg: "Login attempt failed 5 times. Account is now locked." }
            if(json.ErrorMsg) {
                callback( { status: xhr.status, message: json.ErrorMsg }, null)
            }
            else {
                callback(null, json)
            }





        } else if (xhr.status === 401) {

            let message = xhr._response

            // the user's token has expired
            console.log(">>> the user request was unauthorized")
            callback({ status: xhr.status, message: message }, null)

        } else {

            let message = xhr._response

            if(message.indexOf('{') !== -1) {
                let json = JSON.parse(message)
                console.log("error is JSON", JSON.stringify(json, null, 2))

                message = (json.Message || "") + " " + (json.ExceptionMessage || "")
            }

            // What to do when the request has failed
            console.log('something went wrong', xhr);
            callback({ status: xhr.status, message: message }, null)

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