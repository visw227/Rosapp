/*


Note: this is not in use yet. I'm trying to come up with a way to encapsulate all of the 
things that must happen when the app either launches or is resumed (changes from inactive to active)

I’ve been wanting to consolidate the logic for the app launching and the app being resumed, 
since they both can 
    * cause the bio screen to apprear
    * both must refresh the token
    * both must force actions (password change)  


Launch OR re-activate pseuedo code:

if NOT logged in (or first use)

    redirect to login screen

if logged in

    if time to show biometric screen...
        show biometric screen
            refresh the token
                rehydrate the global state
                    redirect to any forced actions (e.g. required password change)

    if not time for biometric
        refresh the token
            rehydrate the global state
                redirect to any forced actions





*/


import { AsyncStorage } from 'react-native';
import { Authorization } from './Authorization';

import NavigationService from './NavigationService';

export var OnAppLaunchOrResume = {


    GetAllKeys: function(callback) {

        let data = {}

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

        let result = {
            err: null,
            data: null, // to share all of the local storage data that this reads
            firstUse: false,
            userData: null,
            lastScreen: null,
            // if true, the lock/biometric screen needs to be loaded
            showLock: false,
            // the screen/stack that should be loaded
            stackToLoad: null, 
            // if showLock=true, redirect to biometricRedirect AFTER showing lock screen
            // if showLock=fase, redirect to biometricRedirect immediately
            biometricRedirect: null
        }


        OnAppLaunchOrResume.GetAllKeys(function(data){

            result.data = data

            // user has never logged in (or has reinstalled the app)
            if(data.userData === null) {


                console.log("userData is null")

                result.firstUse = true
                result.stackToLoad = 'LoginStack'

                // forced login
                NavigationService.navigate('LoginStack')

                return callback(result)

            }
            // IMPORTANT: userData isn't nulled on logout out since it will cause other dependent screens to crash
            // only pasword and token are set to null
            else if(data.userData && data.userData.token === null) {

                console.log("userData, but token is null")

                globalStateChange({ action: "launch", userData: data.userData } )

                result.stackToLoad = 'LoginStack'

                // forced login
                NavigationService.navigate('LoginStack')

                return callback(result)


            }
            else if(data.userData && data.userData.token) {

                console.log("userData & token...", data.userData)
                
                // share what was rehydrated, but they may change later in the logic...
                globalStateChange({ action: "launch", userData: data.userData })
                globalStateChange({ action: "launch", selectedClient: data.selectedClient  })

                // IMPORTANT:
                // Rehydrate the superUser object if available 
                // THIS IS ESPECIALLY important if a superUser exits/closes/terminates the app entirely.
                // Otherwise, when the superUser re-launches the app, they will still be logged in as an impersonated person
                if(data.superUser) {
                    globalStateChange({ action: "launch", superUser: data.superUser } )
                }


                // dont get stuck on one of these screens
                if(data.lastScreen && data.lastScreen === 'LockScreen' || data.lastScreen === 'Login' || data.lastScreen === 'ForgotPassword' || data.lastScreen === 'LoginSelectClient') {
                    data.lastScreen = 'DrawerStack'
                }
                result.lastScreen = data.lastScreen


                // decide this first - even if a forced action is needed like password reset, 
                // we may want to ask for biometric auth first...
                if(data.statusData) {

                    let currentTime = new Date().getTime() // in milliseconds

                    let diff = currentTime - data.statusData.ts

                    // if lastScreen was LockScreen, don't let the user force close the app to get around the lock screen
                    //if(!__DEV__ && (diff >= data.statusData.limit || (data.lastScreen && data.lastScreen === 'LockScreen')) ) {
                    if( diff >= data.statusData.limit || (data.lastScreen && data.lastScreen === 'LockScreen') ) {

                        result.showLock = true
                        result.stackToLoad = 'LockStack'

                        // if forced action, otherwise redirect to lastScreen after biometrics
                        if(data.userData.mustChangePassword ===  true) {
                            result.redirectTo = 'PasswordChangeRequiredStack'
                        }
                        else {
                            result.redirectTo = data.lastScreen
                        }

                        // show biometric screen, which will refresh the token and redirect to the 
                        // forced action OR resume at the lastScreen
                        NavigationService.navigate('LockStack', { 
                            redirectTo: result.redirectTo 
                        });

                        return callback(result)

                    }
                    else {

                        // refresh token now
                        Authorization.RefreshToken(function(err, resp){

                            if(err) {

                                result.stackToLoad = 'LoginStack'

                                // forced login
                                NavigationService.navigate('LoginStack')

                                callback(result)

                            }
                            else {

                                console.log("token refreshed")

                                result.userData = resp.userData
                                result.selectedClient = resp.selectedClient

                                // if we are refreshing the token, we must reset all global state attributes back to defaults as well
                                globalStateChange( { action: "launch", userData: resp.userData })
                                // set/reset selectedClient
                                globalStateChange( { action: "launch", selectedClient: resp.selectedClient  })


                                // look for any forced actions for the user
                                if(resp.userData.mustChangePassword ===  true) {
                                    // forced password change
                                    NavigationService.navigate('PasswordChangeRequiredStack');
                                }
                                else {
                                    // resume at last screen
                                    NavigationService.navigate(data.lastScreen);
                                }

                                return callback(result)
                            
                            } // end else

                        }) // end Authorization.RefreshToken

                    
                    
                    }


                } // end if statusData
                else {

                    console.log(">>> OnAppLaunchOrResume - no statusData")
                    result.stackToLoad = 'LoginStack'

                    // forced login
                    NavigationService.navigate('LoginStack')

                    return callback(result)

                }

            } // end if userData

        }) // end GetAllKeys



    } // end OnEvent






}