import appConfig from '../app-config.json'

// NOTE: an improved way to handle HTTP error responses
const parseFetchResponse = response => response.json().then(text => ({
  status: response.status,
  statusText: response.statusText,
  json: text,
  meta: response,
}))


export function userLogin(request, callback) {
   
  let resStatus = 0
  let url = appConfig.API_HOST + '/api/ManagerAppAuth/AuthenticateUser?userName=' + encodeURI(request.userName) + '&password=' + encodeURI(request.password)

  console.log("login URL", url)
  fetch(url, {  
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })
  .then(res => {
    resStatus = res.status
    //console.log("res.status: " + res.status + ", " + res.statusText)
    if(res.status === 200) {
      return res.json()
    }
    else {
      return res
    }
  })
  .then(res => {

    console.log("userLogin response: ", JSON.stringify(res, null, 2))
    switch (resStatus) {

      case 200:
        console.log("login success")
        callback(null, res)
        break
    

      default:
        console.log("login error", resStatus)
        callback({ status: res.status, message: "Sorry, that's an invalid login. Please check your email address and password and try again." }, null)
        break
    }
  })
  .catch(err => {
    console.error(err)
  })
}

