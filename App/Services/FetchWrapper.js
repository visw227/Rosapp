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
  
  console.log("RESPONSE", response)

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

    // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
    if(config.DOMAIN.indexOf('rosnet') !== -1) {

      protocol = "https://"

      // e.g. https://aag.rosnetqa.com/api/...
      // e.g. https://dashboard.rosnetqa.com/api/...
      fullUrl = protocol + subDomain + "." + config.DOMAIN + url

    }
    else {

      protocol = "http://"

      // e.g. 670b8c88.ngrok.io
      fullUrl = protocol + config.DOMAIN + url


    }




    // tack on timestamp as a cache buster
    // fullUrl = withCacheBustingTimestamp(fullUrl)

    let headers = null

    
    let request =  {  
      method: method
    }

    // for some reason, fetch request gets redirected to login if the Cookie header is provided
    if(token) {
      headers = {
        "managerAppToken": token
      }
    }

    if(headers) {
      request.headers = headers
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

        console.log("RESULTS", results)

        if(results && results.length > 0) {
          return results.json();
        }
        else {
          return results
        }
      })
      .then(results => {
  
        console.log("FINAL RESULTS", results)
  
        if(results.status === 200) {
  
          console.log("fetch success", method, url, results.json)
  
          callback(null, results.json )
    
        }
        else if(results.status === 401) {

          console.log("forced re-login...")
          
          callback( { forceLogin: true }, null)
          
        }
        else {
          console.log("error!!")
          callback({ status: results.status, message: results.json.message || results.statusText }, null)
        }
      })
      .catch(function(error, t, s) {
          console.log("error:", error, "t:", t, "s:", s)
          callback(error)
      });
  
  }
  