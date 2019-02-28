import { fetchWrapper } from './FetchWrapper'

export function reportIssue(client, token, request, callback) {
  
    // login method received credentials as query string params
    let url = '/zendesk/ReportIssue/'
  
    // IMPORTANT: request IS NULL since params are passed in the url of this POST request
    fetchWrapper(url, 'POST', request, client, token, function(err, resp) {
  
      if(err) {
        callback(err)
      }
      else {
        callback(null, resp)
      }
  
    })
  
  }