import { serviceWrapper } from './ServiceWrapper'

export function alertTypes (client,token,callback) {

    let url = '/api/ManagerAppAlertMethods/AlertMethods'
  
    serviceWrapper(url, 'GET',null,client,token,function(err,resp){
      if (err){
        callback(err)
  
      }
      else {
        callback(null,resp)
      }
    })
  
  }
  