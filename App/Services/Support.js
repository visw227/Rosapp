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