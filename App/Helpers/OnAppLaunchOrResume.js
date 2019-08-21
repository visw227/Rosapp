/*


Note: I came up with a way to consolidate all of the 
things that must happen when the app either launches or is resumed (changes from inactive to active), 
since they both can:
    * cause the biometric screen to apprear
    * both must refresh the token
    * both must force actions (e.g. password change)  


Here is some psuedo code: 


if NOT logged in (or first use)

    redirect to login screen

if logged in

    if launch, rehydrate the global state from local storage

    if time to show biometric screen...
        show biometric screen
            refresh the token
                update the global state
                    redirect to last screen or any forced actions (e.g. required password change)

    else
        refresh the token
            update the global state
                redirect to last screen or any forced actions





*/


import { AsyncStorage } from 'react-native';
import { Authorization } from './Authorization';

import NavigationService from './NavigationService';

import brand from '../Styles/brand'

export var OnAppLaunchOrResume = {


    GetAllKeys: function(callback) {

        let data = {
            userData: null,
            superUser: null,
            lastScreen: null,
            statusData: null,
            selectedClient: null
        }

        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];

                    //console.log("key: ", key, value)

                    switch(key) {
                      case "userData":
                        data.userData = JSON.parse(value)
                        break;
                    case "superUser":
                        data.superUser = JSON.parse(value)
                        break;
                      case "lastScreen":
                        data.lastScreen = value
                        break;
                      case "statusData":
                        data.statusData = JSON.parse(value)
                        break;
                    case "selectedClient":
                        data.selectedClient = value // not json
                        break;
                      default:
                        // code block
                    }
                    
                })

                console.log("keys", data)

                callback(data)
            })
        })

    },
    

    // event = 'launch' or 'activate'
    OnEvent: function(event, globalStateChange, callback) {

        console.log("----------------------- OnAppLaunchOrResume.OnEvent --------------------------")

        OnAppLaunchOrResume.GetAllKeys(function(data){
            
            // user has never logged in (or has reinstalled the app)
            if(data.userData === null) {

                console.log("userData is null")

                NavigationService.navigate('LoginStack')

                return callback(data)

            }
            // IMPORTANT: userData isn't nulled on logout out since it will cause other dependent screens to crash
            // only pasword and token are set to null
            else if(data.userData && data.userData.token === null) {

                console.log("userData, but token is null")

                // no need to rehydrate the state if the app is already running
                if(event === 'launch') {
                    // userData exists, so must have logged in before, so rehydrate state
                    globalStateChange({ action: "launch", userData: data.userData } )
                }

                NavigationService.navigate('LoginStack')

                return callback(data)

            }
            // if the user successfully logged in earlier...
            else if(data.userData && data.userData.token) {

                console.log("userData & token...", data.userData)
                
                // no need to rehydrate the state if the app is already running
                if(event === 'launch') {
                    // share what was rehydrated, but they may change later in the logic...
                    globalStateChange({ action: "launch", userData: data.userData })
                    globalStateChange({ action: "launch", selectedClient: data.selectedClient  })
                }

                // IMPORTANT:
                // Rehydrate the superUser object if available 
                // THIS IS ESPECIALLY important if a superUser exits/closes/terminates the app entirely.
                // Otherwise, when the superUser re-launches the app, they will be "really" logged in as an impersonated person
                // no need to rehydrate the state if the app is already running
                if(event === 'launch' && data.superUser) {

                    globalStateChange({ 
                        action: "session-override", 
                        userData: data.userData, 
                        superUser: data.superUser, 
                        backgroundColor:brand.colors.danger})

                }

                // dont get stuck on one of these screens
                if(data.lastScreen && data.lastScreen === 'LockScreen' || data.lastScreen === 'Login' || data.lastScreen === 'ForgotPassword' || data.lastScreen === 'LoginSelectClient') {
                    data.lastScreen = 'DrawerStack'
                }
                let redirectTo = data.lastScreen

                // decide this first - even if a forced action is needed like password reset, 
                // we may want to ask for biometric auth first...
                let currentTime = new Date().getTime() // in milliseconds
                let diff = 0
                let limit = 0
                if(data.statusData) {
                    diff = currentTime - data.statusData.ts
                    limit = data.statusData.limit
                }

                // if lastScreen was LockScreen, don't let the user force close the app to get around the lock screen
                if(!__DEV__ && (diff >= limit || (data.lastScreen && data.lastScreen === 'LockScreen')) ) {
                //if( diff >= limit || (data.lastScreen && data.lastScreen === 'LockScreen') ) {

                    // if forced action, otherwise redirect to lastScreen after biometrics
                    if(data.userData.mustChangePassword ===  true) {
                        redirectTo = 'PasswordChangeRequiredStack'
                    }

                    // show biometric screen, which will refresh the token and redirect to the 
                    // forced action OR resume at the lastScreen
                    NavigationService.navigate('LockStack', { 
                        redirectTo: redirectTo 
                    });

                    return callback(data)

                }
                else {

                    if(event === 'activate') {
                        return callback(data)
                    }
                    else if(event === 'launch') {
                        // CANNOT use .RefreshToken because it may be a QA session override
                        // and the impersonated userData.password is not really known and contains "***"
                        // Instead, just verify the token AFTER the user sees the biometric screen
                        let token = data.userData.token
                        let client = data.selectedClient
                        Authorization.VerifyToken(client, token, function(err, resp){

                            if(err) {

                                // forced login
                                NavigationService.navigate('LoginStack')

                                callback(data)

                            }
                            else {

                                console.log("token refreshed")

                                // if we are refreshing the token, we must reset all global state attributes back to defaults as well
                                globalStateChange( { action: "launch", userData: resp.userData })
                                // set/reset selectedClient
                                globalStateChange( { action: "launch", selectedClient: resp.selectedClient  })


                                // look for any forced actions that the user might still need to address
                                if(data.userData.mustChangePassword ===  true) {
                                    // forced password change
                                    NavigationService.navigate('PasswordChangeRequiredStack');
                                }
                                else {
                                    // resume at last screen
                                    NavigationService.navigate(data.lastScreen);
                                }

                                return callback(data)
                            
                            } // end else

                        }) // end Authorization.RefreshToken

                    } // end if event = launch

                } // end if( diff >= data.statusData.limit


            } // end if userData

        }) // end GetAllKeys

    } // end OnEvent


}