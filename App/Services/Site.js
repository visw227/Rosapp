import { serviceWrapper } from './ServiceWrapper'

/*

  {
    Timeout_Mins: 180
  }
  
*/

export function getSecuritySettings(client, token, callback) {

  serviceWrapper('/api/ManagerAppSite/SecuritySettings', 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}