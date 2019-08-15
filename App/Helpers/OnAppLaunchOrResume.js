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
                redirect to any forced actions (e.g. required password change)

    if not time for biometric
        refresh the token
            redirect to any forced actions





*/


import { AsyncStorage } from 'react-native';
import { Authorization } from './Authorization';

import NavigationService from './NavigationService';

export var OnAppLaunchOrResume = {


    GetAllKeys: function(callback) {

        let keys = {}

        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];

                    switch(key) {
                      case "userData":
                        keys.userData = JSON.parse(value)
                        break;
                      case "lastScreen":
                        keys.lastScreen = value
                        break;
                      case "statusData":
                        keys.statusData = JSON.parse(value)
                        break;
                      default:
                        // code block
                    }

                    
                })

                console.log(">>> OnAppLaunchOrResume ALL keys", keys)


                callback(keys)
            })
        })

    },

    // event = 'launch' or 'activate'
    OnEvent: function(event, callback) {

        let result = {
            error: null,
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


        OnAppLaunchOrResume.GetAllKeys(function(keys){

            let userData = keys.userData
            let lastScreen = keys.lastScreen
            let statusData = keys.statusData
            let routeName = null

            // user has never logged in (or has reinstalled the app)
            if(userData === null) {

                // forced login
                NavigationService.navigate('LoginStack')

                return callback(null, null)

            }
            // IMPORTANT: userData isn't nulled on logout out since it will cause other dependent screens to crash
            // only pasword and token are set to null
            else if(userData && userData.token === null) {

                // forced login
                NavigationService.navigate('LoginStack')

                return callback(null, null)


            }
            else if(userData && userData.token) {
                    
                // dont get stuck on one of these screens
                if(lastScreen && lastScreen === 'LockScreen' || lastScreen === 'Login' || lastScreen === 'ForgotPassword' || lastScreen === 'LoginSelectClient') {
                    lastScreen = 'DrawerStack'
                }

                // decided this first - even if a forced action is needed like password reset, 
                // we may want to ask for biometric auth first...
                if(statusData) {

                    let currentTime = new Date().getTime() // in milliseconds

                    let diff = currentTime - statusData.ts

                    //if(!__DEV__ && (diff >= statusData.limit || (lastScreen && lastScreen === 'LockScreen')) ) {
                    if( diff >= statusData.limit || (lastScreen && lastScreen === 'LockScreen') ) {

                        // show biometric screen, which will refresh the token and redirect to the 
                        // forced action OR resume at the lastScreen
                        NavigationService.navigate('LockStack', { 
                            lastScreen: lastScreen, 
                            redirectTo: result.redirectTo 
                        });

                        callback(null, null)

                    }
                    else {

                        // refresh token now
                        Authorization.RefreshToken(function(err, resp){

                            if(err) {

                                // forced login
                                NavigationService.navigate('LoginStack')

                                callback(null, null)

                            }
                            else {

                                console.log("token refreshed")

                                // if we are refreshing the token, we must reset all global state attributes back to defaults as well
                                //_this._globalStateChange( { action: "token-refresh", userData: resp.userData })


                                // look for any forced actions for the user
                                if(userData.mustChangePassword ===  true) {
                                    // forced password change
                                    NavigationService.navigate('PasswordChangeRequiredStack');
                                }
                                else {
                                    // resume at last screen
                                    NavigationService.navigate(lastScreen);
                                }

                                callback(null, resp.userData)
                            
                            } // end else

                        }) // end Authorization.RefreshToken

                    }


                }
 

            } // end if userData

        }) // end GetAllKeys



    } // end OnEvent






}