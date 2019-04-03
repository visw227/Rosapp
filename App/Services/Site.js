import { serviceWrapper } from './ServiceWrapper'
import { Parsers } from '../Helpers/Parsers'

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

export function getStaffList(client, token, location, callback) {

  serviceWrapper('/api/ManagerAppSite/StaffList?location=' + location, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {

      let list = Parsers.StaffMembers(resp)

      callback(null, list)
    }

  })


}
