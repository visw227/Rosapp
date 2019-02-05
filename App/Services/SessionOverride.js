import { fetchWrapper } from './FetchWrapper'

export function searchUsers(query, limit, client, cookies, callback) {

  fetchWrapper('/api/ManagerAppSessionOverride/UserSearch?limit=' + limit + "&query=" + query, 'GET', null, client, cookies, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}