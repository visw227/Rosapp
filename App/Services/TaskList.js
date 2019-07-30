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
 