import { fetchWrapper } from './FetchWrapper'

/*

  {
    Timeout_Mins: 180
  }
  
*/

export function getSecuritySettings(client, token, callback) {

  fetchWrapper('/api/ManagerAppSite/SecuritySettings', 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}