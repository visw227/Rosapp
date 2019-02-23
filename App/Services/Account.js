import { fetchWrapper } from './FetchWrapper'


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
//     ]
// }

export function userLogin(request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/Login'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  fetchWrapper(url, 'POST', request, 'dashboard', null, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}


export function userLogout(client, token, callback) {
    
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/Logout'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  fetchWrapper(url, 'GET', null, client, token, function(err, resp) {
    if(err) {
      callback(err)
    }
    else {
            callback(null, resp)
    } 
  })
}

export function changePassword (request, token, callback) {


  let url = '/Signon/PasswordChangeExec?userId=' + encodeURI(request.userId) + '&password=' + encodeURI(request.password)

  fetchWrapper(url, 'GET', null, request.clientCode , token, function(err, resp) {
    if (err) {
      callback(err)

    }
     else { 
       callback(null,resp)
       
       let emailUrl = '/api/ManagerAppAuth/EmailPasswordChange?email='+encodeURI(request.email)+'&selectedSite'+encodeURI(request.clientCode)+'&userID='+encodeURI(request.userId)
       
       fetchWrapper(emailUrl, 'POST', null, request.clientCode , token, function(err, resp) {
        if (err) {
          //callback(err)
          console.log('email Error')
    
        }
         else { 
           console.log('email sent to user')      
         }
      } )
     }
  } )


}


export function changePasswordAccess (request,callback) {

  let url = '/api/ManagerAppAuth/changePasswordAccess'

  fetchWrapper(url, 'GET', null,request,null,function(err,resp){
    if (err){
      callback(err)

    }
    else {
      callback(null,resp)
    }
  })

}


export function forgotPassword(request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/RetrievePassword'

  // IMPORTANT: request IS NULL since params are passed in the url of this POST request
  fetchWrapper(url, 'POST', request, 'dashboard', null, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}
