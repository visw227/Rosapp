
import { AppCenter } from 'appcenter'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'


//***********************************************************************************************
// Adding device id and App Center install id to the header of every API request to track last activity
// Note: using X- as a prefix for custom headers is discouraged as of a 2011 IEFT draft
//***********************************************************************************************

// this approach will add headers to each request on-the-fly, but only need to set once for all requests
// api.addAsyncRequestTransform(request => async () => {
//   api.setHeader('device-id', DeviceInfo.getUniqueID())
//   let appInstallId = await AppCenter.getInstallId()
//   api.setHeader('app-install-id', appInstallId)
//   console.log('api.headers: ', JSON.stringify(api.headers, null, 2))
// })


// TODO: Need logic for https://stafflinq.com, PROD
export const getHeaders = (token, contentType) => {

    let deviceType = Platform.OS.toUpperCase() === 'ANDROID'? 1 : Platform.OS.toUpperCase() === 'IOS' ? 2 : 0

    let headers = {
        'Authorization': token,
        'Content-Type': contentType, //'application/json',
        'platform-os': Platform.OS,
        'device-type': deviceType.toString(),
        //'device-id': DeviceInfo.getUniqueID(),
        'app-install-id': ''
    }


    // this is async
    AppCenter.getInstallId().then(async (response) => {

        headers['app-install-id'] = response

        return headers

    })
    



}
