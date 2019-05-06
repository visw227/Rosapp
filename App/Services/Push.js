import { serviceWrapper } from './ServiceWrapper'


 //ManagerAppAlertMethods/GetNotifications?userId=454&includeHidden=1
 export function GetNotifications (request,callback) {

    let url = '/api/ManagerAppAlertMethods/GetNotifications?userName='+encodeURI(request.userName)+'&includeHidden='+'true'
  
    serviceWrapper(url,'GET',null,request.client,request.token,function(err,resp){
      if(err){
        callback(err)
      }
      else {
        callback(null,resp)
      }
    })
  
  }
  
 //ManagerAppAlertMethods/updateFcmDeviceToken?appInstallId=454&fcmDeviceToken=gfgehfhef&userId=29269
 export function updateFcmDeviceToken (request,callback) {

    let url = '/api/ManagerAppAlertMethods/updateFcmDeviceToken?appInstallId='+encodeURI(request.appInstallId)+'&fcmDeviceToken='+encodeURI(request.fcmDeviceToken)+'&userId='+encodeURI(request.userId)
  
    serviceWrapper(url,'GET',null,request.client,request.token,function(err,resp){
      if(err){
        callback(err)
      }
      else {
        callback(null,resp)
      }
    })
  
  }

  