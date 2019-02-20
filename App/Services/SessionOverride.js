import { fetchWrapper } from './FetchWrapper'

export function searchUsers(query, limit, client, token, callback) {

  let url = '/api/ManagerAppSessionOverride/UserSearch?limit=' + limit + "&query=" + query

  fetchWrapper(url, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}


export function impersonateUser(client, token, request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/SuperUser'

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
