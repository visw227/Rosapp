import { serviceWrapper } from './ServiceWrapper'

export function reportIssue(client, token, request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppZendesk/ReportIssue/'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'POST', request, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}

export function getRequests(client, token, email, callback) {

  let url = '/api/ManagerAppZendesk/Requests?email=' + email + '&count=null&page=null'

  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}

export function searchUsersByEmail(client, token, email, callback) {

  let url = '/api/ManagerAppZendesk/SearchUsersByEmail?email=' + email

  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}

export function searchUsersByRosnetExternalID(client, token, rosnet_user_id, callback) {

  let url = '/api/ManagerAppZendesk/SearchUsersByRosnetExternalID?rosnet_user_id=' + rosnet_user_id

  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}

/*
{
    "rosnet_user_id" : 1234, // this is the ExternalID for Zendesk
    "email": "testuser2@rosnet.com", 
    "name": "Test User2",
    "location": 0
}

*/
export function registerUser(client, token, request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppZendesk/AddUser'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'POST', request, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}