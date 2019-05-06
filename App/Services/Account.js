import { serviceWrapper } from './ServiceWrapper'


// {
//     "Success": true,
//     "ErrorMsg": null,
//     "SecurityToken": "4a739193-80aa-4f42-a5e8-5536ef92ff21",
//     "Rosnet_User_ID": 26472,
//     "Browse_User_Name": "dywayne.johnson",
//     "Common_Name": "Dywayne Johnson",
//     "My_Entrprise_Id": null,
//     "Rosnet_Employee": false,
//     "Sites": [
//         "DOHERTY",
//         "AAG",
//         "AMETRO",
//     ],
//     "Must_Change_Password": false
// }

export function userLogin(request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/Login'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'POST', request, 'dashboard', null, function(err, resp) {

    if(err) {
      console.log("login error", err)
      callback(err)
    }
    else {
      console.log("login success", resp)
      callback(null, resp)
    }

  })

}


export function userLogout(client, token, callback) {
    
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/Logout'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {
    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    } 
  })
}


export function verifyToken(client, token, callback) {
    
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/VerifyToken'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'GET', null, client, token, function(err, resp) {
    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    } 
  })
}


export function changePassword (request, token, callback) {


  let url = '/Signon/PasswordChangeExec?userId=' + encodeURI(request.userId) + '&password=' + encodeURI(request.password) + '&app=true'

  serviceWrapper(url, 'GET', null, request.clientCode , token, function(err, resp) {
    if (err) {
      callback(err)

    }
     else { 
       callback(null, resp)
       
       let emailUrl = '/api/ManagerAppAuth/EmailPasswordChange?email='+encodeURI(request.email)+'&selectedSite='+encodeURI(request.clientCode)+'&userID='+encodeURI(request.userId)
       
       serviceWrapper(emailUrl, 'GET', null, request.clientCode , token, function(err, resp) {
        if (err) {
          
          // DONT do callback here. It already happened above
          //callback(err)
          //console.log('email Error')
    
        }
         else { 
           
          //DONT do callback here. It already happened above
          //callback(null, resp)
          
          //console.log('email sent to user')      
         }
      } )
     }
  } )


}


// export function changePasswordAccess (client,token,callback) {

//   let url = '/api/ManagerAppAuth/changePasswordAccess'

//   serviceWrapper(url, 'GET', null,client,token,function(err,resp){
//     if (err){
//       callback(err)

//     }
//     else {
//       callback(null,resp)
//     }
//   })

// }


export function forgotPassword(request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/RetrievePassword'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  serviceWrapper(url, 'POST', request, 'dashboard', null, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}

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
// http: //localhost:8085/api/ManagerAppAlertMethods/storeSubscription?userName=vchikkala&alertTypeID=3&desc=test&email=0&push=1
export function alertSubscription (request,callback) {

  let url = '/api/ManagerAppAlertMethods/storeSubscription?userName='+encodeURI(request.userName)+'&alertTypeID='+encodeURI(request.alertTypeID)+'&desc='+encodeURI(request.desc)+'&email='+encodeURI(request.email)+'&push='+encodeURI(request.push)

  serviceWrapper(url,'GET',null,request.client,request.token,function(err,resp){
    if(err){
      callback(err)
    }
    else {
      callback(null,resp)
    }
  })

}

export function retrieveSubscription (request,callback) {

  let url = '/api/ManagerAppAlertMethods/retrieveSubscription?userName='+encodeURI(request.userName)

  serviceWrapper(url,'GET',null,request.client,request.token,function(err,resp){
    if(err){
      callback(err)
    }
    else {
      callback(null,resp)
    }
  })

}

export function backfillSubscription (request,callback) {

  let url = '/api/ManagerAppAlertMethods/backfillSubscription?userName='+encodeURI(request.userName)

  serviceWrapper(url,'GET',null,request.client,request.token,function(err,resp){
    if(err){
      callback(err)
    }
    else {
      callback(null,resp)
    }
  })

}

