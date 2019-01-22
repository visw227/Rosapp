//******************************************************************************
// djohnson - January 17, 2019
// this is a handy wrapper for fetch requests
//******************************************************************************

import { getHost, withCacheBustingTimestamp } from './Domain';

const parseFetchResponse = response => response.json().then(text => ({
  status: response.status,
  statusText: response.statusText,
  json: text,
  meta: response,
}))

export function fetchWrapper(url, method, jsonBody, token, callback) {
    
    //let url = withCacheBustingTimestamp(getHost() + '/api/schedule/createTimeOff')
    let fullUrl = withCacheBustingTimestamp(getHost() + url)

    //console.log("createTimeOffRequest- request: ", JSON.stringify(data, null, 2))
    
    let config =  {  
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    // only add Authorization to header if token is provided
    if(token) {
      config.headers.Authorization = token
    }

    // only add the body if this is a POST/PUT
    if(method === 'POST' || method === 'PUT') { 
      config.body = JSON.stringify(jsonBody) 
    }

    fetch(fullUrl, config)
      .then(parseFetchResponse) // parses the standard HTTP response with any custom JSON body
      // make sure result body is sent back from API
      .then((results) => {
        if(results && results.length > 0) {
          return results.json();
        }
        else {
          return results
        }
      })
      .then(results => {
  
  
        if(results.status === 200) {
  
          console.log("fetch success", method, url, results.json)
  
          callback(null, results.json )
    
        }
        else if(results.status === 401) {

          callback( { forceLogin: true }, null)
          
        }
        else {
          console.log("error!!")
          callback({ status: results.status, message: results.json.message || results.statusText }, null)
        }
      })
      .catch(function(error) {
          console.log("error:", error)
          callback(error)
      });
  
  }
  