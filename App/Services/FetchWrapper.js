//******************************************************************************
// djohnson - January 17, 2019
// this is a handy wrapper for fetch requests
//******************************************************************************

import config from '../app-config.json'
import { withCacheBustingTimestamp } from '../Helpers/WithCacheBustingTimestamp';

// const parseFetchResponse = response => response.json().then(text => ({
//   status: response.status,
//   statusText: response.statusText,
//   json: text,
//   meta: response,
// }))

const parseFetchResponse = (response) => {
  
  //console.log("RESPONSE", response)

  let results = response.json().then(text => ({
    status: response.status,
    statusText: response.statusText,
    json: text,
    meta: response,
  }))

  return results
}

export function fetchWrapper(url, method, jsonBody, subDomain, token, callback) {


    let fullUrl = ''
    let protocol = ''

    console.log('subDomain', subDomain)

    // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
    if(config.DOMAIN.indexOf('rosnet') !== -1) {
      protocol = "https://"
    }
    else {
      protocol = "http://"
    }

    fullUrl = protocol + subDomain + "." + config.DOMAIN + url
    console.log("fullUrl", fullUrl)

    // tack on timestamp as a cache buster
    fullUrl = withCacheBustingTimestamp(fullUrl)

    let request =  {  
      method: method,
      headers: {
        "content-type": "application/json"
      }
    }

    // for some reason, fetch request gets redirected to login if the Cookie header is provided
    if(token) {
      request.headers.managerAppToken = token
    }



    // only add the body if this is a POST/PUT
    if(jsonBody && (method === 'POST' || method === 'PUT') ) { 
      request.body = JSON.stringify(jsonBody) 
    }

    console.log("url: ", fullUrl)
    //console.log("request: ", JSON.stringify(request, null, 2))



    // Set up our HTTP request
    var xhr = new XMLHttpRequest();

    xhr.timeout = 5000; // time in milliseconds

  // Setup our listener to process compeleted requests
    xhr.onerror = function (err) {
      console.log("error", err)
    }
    xhr.onloadstart = function () {
      console.log("onloadstart")
    }
    xhr.onprogress = function () {
      console.log("onprogress")
    }
    xhr.onabort = function () {
      console.log("abort")
    }
    xhr.ontimeout = function () {
      console.log("timeout")
      
    }
    xhr.onreadystatechange = function () {

      console.log("xhr.onreadstatechange", xhr)

      // Only run if the request is complete
      if (xhr.readyState !== 4) return;

      // Process our return data
      if (xhr.status >= 200 && xhr.status < 300) {

        // var isValidJSON = true;
        // try { 
        //   JSON.parse(xhr.response) 
        // }
        // catch(e) { 
        //   isValidJSON = false 
        // }

        let json = JSON.parse(xhr.response)

        console.log("xhr.response", json)

        callback(null, json)

      }
      else if(xhr.status === 401) {

        // the user's token has expired

      } 
      else {

        let message = xhr._response

        // What to do when the request has failed
        console.log('something went wrong', xhr);
        callback( { status: xhr.status, message: message }, null)

      }

    };

    // Create and send a GET request
    // The first argument is the post type (GET, POST, PUT, DELETE, etc.)
    // The second argument is the endpoint URL
    xhr.open(method, fullUrl);
    xhr.setRequestHeader("Content-Type", "application/json");
    // xhr.setRequestHeader("Accept", "application/json");
    xhr.send(JSON.stringify(jsonBody) );

}

// export function fetchWrapper(url, method, jsonBody, subDomain, token, callback) {
    
//     let fullUrl = ''
//     let protocol = ''

//     console.log('subDomain', subDomain)

//     // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
//     if(config.DOMAIN.indexOf('rosnet') !== -1) {
//       protocol = "https://"
//     }
//     else {
//       protocol = "http://"
//     }

//     fullUrl = protocol + subDomain + "." + config.DOMAIN + url
//     console.log("fullUrl", fullUrl)

//     // tack on timestamp as a cache buster
//     // fullUrl = withCacheBustingTimestamp(fullUrl)


    
//     let request =  {  
//       method: method,
//       headers: {
//         "content-type": "application/json"
//       }
//     }

//     // for some reason, fetch request gets redirected to login if the Cookie header is provided
//     if(token) {
//       request.headers.managerAppToken = token
//     }



//     // only add the body if this is a POST/PUT
//     if(jsonBody && (method === 'POST' || method === 'PUT') ) { 
//       request.body = JSON.stringify(jsonBody) 
//     }

//     console.log("url: ", fullUrl)
//     console.log("request: ", JSON.stringify(request, null, 2))

//     fetch(fullUrl, request)
//       .then(parseFetchResponse) // parses the standard HTTP response with any custom JSON body
//       // make sure result body is sent back from API
//       .then((results) => {

//         //console.log("RESULTS", results)

//         if(results && results.length > 0) {
//           return results.json();
//         }
//         else {
//           return results
//         }
//       })
//       .then(results => {
  
//         //console.log("FINAL RESULTS", results)
  
//         if(results.status === 200) {
  
//           console.log("fetch success", method, url, results.json)
  
//           callback(null, results.json )
    
//         }
//         else if(results.status === 401) {

//           console.log("401 response, so send to login screen...")
          
//           callback( { forceLogin: true }, null)
          
//         }
//         else {
//           console.log(results.status + " response, so not sure what to do: ", results)
//           callback({ status: results.status, message: results.json.message || results.statusText }, null)
//         }
//       })
//       .catch(function(error) {
//           console.log("fetchWrapper had an unexpected error:", error)
//           callback(error)
//       });
  
//   }
  





