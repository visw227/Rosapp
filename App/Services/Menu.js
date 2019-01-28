import appConfig from '../app-config.json'
import { dynamicSort } from '../Helpers/DynamicSort';

// NOTE: See getSwapEmployeeSchedule for an improved way to handle HTTP error responses

// NOTE: an improved way to handle HTTP error responses
const parseFetchResponse = response => response.json().then(text => ({
  status: response.status,
  statusText: response.statusText,
  json: text,
  meta: response,
}))


export function getMobileMenuItems(cookies, callback) {

  let resStatus = 0
  let url = appConfig.API_HOST + '/api/ManagerAppMenu'

  console.log("getMobileMenuItems", url, cookies)

  console.log("getMobileMenuItems URL", url)
  fetch(url, {  
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
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

    console.log("getMobileMenuItems response: ", JSON.stringify(res, null, 2))
    switch (resStatus) {

      case 200:
        console.log("success")
        callback(null, res)
        break
    

      default:
        console.log("error", resStatus)
        callback({ status: res.status, message: "We're sorry, but an error occurred." }, null)
        break
    }
  })
  .catch(err => {
    console.error(err)
  })

}
