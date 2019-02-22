import { fetchWrapper } from './FetchWrapper'

export function getSiteSecuritySettings (request,callback) {

  let url = '/api/Security/ManagerAppSecSetting?selectedClient='+request

  fetchWrapper(url, 'GET', null, request, null, function(err,resp){
    if (err){
      callback(err)

    }
    else {
      callback(null,resp)
    }
  })

}