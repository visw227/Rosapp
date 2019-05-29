
import config from '../app-config.json'
import { Utils } from '../Helpers/Utils';

export var Chat = {


    // this is separate in case we want to keep the Authorization token
    Authenticate: function(app, client, token, callback) {

         let url = '/api/chat/authenticate?app=' + app + '&client=' + client + '&token=' + token

         Chat.RequestHelper(url, 'GET', null, client, token, function(err, resp){

            if(err) {
                //console.log("Chat.Authenticate error", err)
                callback(err, null)
            }
            else {
                //console.log("Chat.Authenticate success", resp)
                callback(null, resp)
            }
             
         })
       

    }, 

    GetUnreadMessageCount: function(app, client, token, callback) {


        Chat.Authenticate(app, client, token, function(err, resp){

            if(err) {
                callback(err, null)
            }
            else {

                let url = '/api/chat/conversationGetUnreadMessageCount'

                Chat.RequestHelper(url, 'GET', null, client, resp.Authorization, function(err, resp){

                    if(err) {
                        //console.log("Chat.GetUnreadMessageCount error", err)
                        callback(err, null)
                    }
                    else {
                        //console.log("Chat.GetUnreadMessageCount success", resp)
                        callback(null, resp)
                    }
                    
                })

            }
        })




    },

    // Chat needs it's own process that passes Authorization header
    RequestHelper: function(url, method, jsonBody, subDomain, token, callback) {

        // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
        if (config.DOMAIN.indexOf('rosnet') !== -1) {
            protocol = "https://"
        } else {
            protocol = "http://"
        }

        fullUrl = protocol + subDomain + "." + config.DOMAIN + url

        //console.log("fullUrl", fullUrl)

        // Set up our HTTP request
        var xhr = new XMLHttpRequest();

        xhr.timeout = 15000; // time in milliseconds


        xhr.onreadystatechange = function() {

            //console.log("xhr.onreadstatechange", xhr)

            // Only run if the request is complete
            if (xhr.readyState !== 4) return;

            // Process our return data
            if (xhr.status === 200) {

                let json = JSON.parse(xhr.response)

                //console.log("xhr.response", json)

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
                //console.log(">>> the user request was unauthorized")
                //console.log("xhr", xhr)

                callback({ status: xhr.status, message: message }, null)

            } 
            else {

                // BE AWARE - PC4 responses are VERY unpredictable
                // They can be text strings, HTML, or a JSON object... have fun

                //console.log("------------------------------------ ERROR: " + xhr.status + " ---------------------------------------")

                //console.log("xhr._response", xhr._response)
                let message = xhr._response

                if(message.indexOf('{') !== -1) {

                    //console.log("error is JSON", JSON.stringify(json, null, 2))

                    let json = JSON.parse(message)


                    message = (json.Message || "") + " " + (json.ExceptionMessage || "")
                }
                else if(message.indexOf('<') !== -1) {

                    //console.log("error is HTML", message)
                    message = "An error occurred, but the response was HTML so unable to parse."
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
        xhr.setRequestHeader("Authorization", token);

        // send the request
        if (jsonBody && (method === 'POST' || method === 'PUT')) {
            xhr.send(JSON.stringify(jsonBody));
        } else {
            xhr.send(); // GET
        }


    }








}
