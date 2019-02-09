
// example usage; sorting ascending by a specific object property
// myArray.sort(dynamicSort('my_attribute', 1)) 
export function parseUser(response) {

    let userData = {
        token: response.SecurityToken,
        userId: response.Rosnet_User_ID,
        userName: response.Browse_User_Name,
        commonName: response.Common_Name,
        sites: response.Sites || [], // just in case null
        isRosnetEmployee: response.Rosnet_Employee
    }

    // sort before persisting
    if(response.Sites && response.Sites.length > 0) {
        userData.sites.sort()
    }
    else {
        userData.sites = [""] // make sure something is there to assign sites[0] elsewhere
    }

    userData.selectedSite = userData.sites[0]

    return userData

}
