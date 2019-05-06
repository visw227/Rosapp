import { serviceWrapper } from './ServiceWrapper'
import { Parsers } from '../Helpers/Parsers'

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


export function getUserIdForClient(client, token, userName, callback) {

  serviceWrapper('/api/ManagerAppSite/getBrowseUserId?userName=' + userName, 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}

export function isSiteAvailable(client, token, callback) {

  serviceWrapper('/api/ManagerAppSite/isSiteAvailable', 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}
