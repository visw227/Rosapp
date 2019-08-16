import { serviceWrapper } from './ServiceWrapper'


 //ManagerAppAlertMethods/GetNotifications?userId=454&includeHidden=1
 export function GetTaskLists (request,callback) {

    let url = '/api/ManagerAppTaskList/GetTaskLists'
  
    serviceWrapper(url,'GET',null,request.client,request.token,false,function(err,resp){
      if(err){
        callback(err)
      }
      else {
        callback(null,resp)
      }
    })
  
  }

  export function UpdateStep (client,token,request,callback) {

    let url = '/api/ManagerAppTaskList/UpdateStep'
  
    serviceWrapper(url,'POST',request,client,token,false,function(err,resp){
      if(err){
        callback(err)
      }
      else {
        callback(null,resp)
      }
    })
  
  }
 