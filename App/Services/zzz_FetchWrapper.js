/*








THIS HAS BEEN ABANDONED!!!!
See ServiceWrapper.js instead







*/




//******************************************************************************
// djohnson - January 17, 2019
// this is a handy wrapper for fetch requests
//******************************************************************************

import config from '../app-config.json'
import { withCacheBustingTimestamp } from '../Helpers/WithCacheBustingTimestamp';


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
    // fullUrl = withCacheBustingTimestamp(fullUrl)


    
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
    console.log("request: ", JSON.stringify(request, null, 2))

    fetch(fullUrl, request)
      .then(parseFetchResponse) // parses the standard HTTP response with any custom JSON body
      // make sure result body is sent back from API
      .then((results) => {

        //console.log("RESULTS", results)

        if(results && results.length > 0) {
          return results.json();
        }
        else {
          return results
        }
      })
      .then(results => {
  
        //console.log("FINAL RESULTS", results)
  
        if(results.status === 200) {
  
          console.log("fetch success", method, url, results.json)
  
          callback(null, results.json )
    
        }
        else if(results.status === 401) {

          console.log("401 response, so send to login screen...")
          
          callback( { forceLogin: true }, null)
          
        }
        else {
          console.log(results.status + " response, so not sure what to do: ", results)
          callback({ status: results.status, message: results.json.message || results.statusText }, null)
        }
      })
      .catch(function(error) {
          console.log("fetchWrapper had an unexpected error:", error)
          callback(error)
      });
  
  }
  




