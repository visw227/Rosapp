
/*

NOTE: Chat uses it's own RequestHelper (not ServiceWrapper) since the chat API uses a different
authentication header, which is a hybrid token shared by both the Stafflinq and Rosnet apps

*/


import { Config } from './Config';

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

                let url = '/api/chat/getUnreadMessageCount'

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
        // if (config.DOMAIN.indexOf('rosnet') !== -1) {
        //     protocol = "https://"
        // } else {
        //     protocol = "http://"
        // }
        let config = Config.Environment()

        fullUrl = config.DOMAIN_PROTOCOL + subDomain + "." + config.DOMAIN + url

        //console.log("Chat.js fullUrl", fullUrl)

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

                callback(null, json)

            } 
            else if (xhr.status === 401) {

                let message = xhr._response

                // the user's Authorization has expired
                //console.log(">>> the user request was unauthorized")
                //console.log("xhr", xhr)

                callback({ status: xhr.status, message: message }, null)

            } 
            else {

                //console.log("xhr._response", xhr._response)
                let message = xhr._response

                // What to do when the request has failed
                //console.log('something went wrong', xhr);
                callback({ status: xhr.status, message: message }, null)

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
