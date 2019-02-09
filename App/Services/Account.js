import { fetchWrapper } from './FetchWrapper'


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

export function changePassword (request, token, callback) {


  let url = '/Signon/PasswordChangeExec?userId=' + encodeURI(request.userId) + '&password=' + encodeURI(request.password)

  fetchWrapper(url, 'POST', null, 'aag' , token, function(err, resp) {
    if (err) {
      callback(err)

    }
     else { 
       callback(null,resp)
     }
  } )


}

