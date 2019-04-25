import { serviceWrapper } from './ServiceWrapper'

export function searchUsers(query, limit, client, token, callback) {

  let url = '/api/ManagerAppSessionOverride/UserSearch?limit=' + limit + "&query=" + query

  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {

      resp.forEach(function(p){

        // if a level 1 user and their location isn't in their name, then add it to the group name
        if(p.level === 1 && p.name.indexOf(p.location.toString()) === -1) {
          p.group += ' (Location ' + p.location + ')'
        }

      })

      callback(null, resp)
    }

  })


}


export function impersonateUser(client, token, request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/SuperUser'

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
