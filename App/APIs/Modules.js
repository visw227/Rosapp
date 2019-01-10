import appConfig from '../app-config.json'
import { dynamicSort } from '../Lib/DynamicSort';

let fakedMenu = require('../Fixtures/Modules')

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
  let url = appConfig.API_HOST + '/api/ManagerAppModule/MobileNestedV1'

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

export function getTopMenu(token, callback) {
    
    let data = fakedMenu["Heirarchy"]

    let items = data.filter(function(item){
      return !item.Parent_Menu_Heirarchy_ID
    })

    items.sort(dynamicSort('Ordinal', 1)) 

    // strip off "fa-" from icon name
    items.forEach(function(item){
        item.Icon = item.Icon.replace('fa-', '')
    })

    //console.log("found ", items)

    callback(null, items)


}


export function getSubMenu(token, parentId, callback) {
    

    let data = fakedMenu["Heirarchy"]

    let items = data.filter(function(item){
      return item.Parent_Menu_Heirarchy_ID === parentId
    })

    items.sort(dynamicSort('Ordinal', 1)) 

    // strip off "fa-" from icon name
    // items.forEach(function(item){
    //     item.Icon = item.Icon.replace('fa-', '')
    // })

    //console.log("submenu", items)

    callback(null, items)


}


export function getSubMenuItems(token, parentId, callback) {
    

    let data = fakedMenu["Items"]


    let items = data.filter(function(item){
      return item.Menu_Heirarchy_ID === parentId
    })

    items.sort(dynamicSort('Ordinal', 1)) 

    // do this so I don't have to deal with Name missing
    items.forEach(function(item){
        item.Name = item.Menu_Function_Name
    })

    // strip off "fa-" from icon name
    // items.forEach(function(item){
    //     item.Icon = item.Icon.replace('fa-', '')
    // })

    //console.log("items", items)

    callback(null, items)


}


export function getModuleItemsByIdList(idList, callback) {
    
    let data = fakedMenu["Items"]

    let items = []
    data.forEach(function(item){
        if(idList.includes(item.Menu_Function_ID)) {
            //console.log("found item", item)
            items.push(item)
        }
    })

    // do this so I don't have to deal with Name missing
    items.forEach(function(item){
        item.Name = item.Menu_Function_Name
        item.Path = item.Path.replace('&gt;', ' > ')
    })

    items.sort(dynamicSort('Name', 1)) 

    // console.log("items", items)

    callback(null, items)

}