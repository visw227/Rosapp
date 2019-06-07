import { serviceWrapper } from './ServiceWrapper'

export function getSiteSecuritySettings (request,callback) {

  let url = '/api/Security/ManagerAppSecSetting?selectedClient='+request

  serviceWrapper(url, 'GET', null, request, null, true, function(err,resp){
    if (err){
      callback(err)

    }
    else {
      callback(null,resp)
    }
  })

}