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
  let url = '/api/ManagerAppAuth/AuthenticateUser'

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



export function forgotPassword(request, callback) {
  
  // login method received credentials as query string params
  let url = '/api/ManagerAppAuth/ForgotPassword'

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
