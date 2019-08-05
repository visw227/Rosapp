/*


Note: this is not in use yet. I'm trying to come up with a way to encapsulate all of the 
things that must happen when the app either launches or is resumed (changes from inactive to active)








*/


import { AsyncStorage } from 'react-native';
import { Authorization } from './Authorization';

export var OnAppLaunchOrResume = {


    // event = 'launch' or 'activate'
    OnEvent: function(event, callback) {

        let result = {
            error: null,
            userData: null,
            lastScreen: null,
            forcedScreen: null
        }




        AsyncStorage.getItem('userData').then((data) => {

            let userData = null
            let routeName = null

            //console.log("LaunchScreen - userData: ", data)

            if(data) {

                userData = JSON.parse(data)

                console.log("ForcedActions - userData: ", userData)

                if(userData && userData.token) {


                    result.userData = userData


                    // this MAY cause a 401 redirect to login 
                    Authorization.RefreshToken(function(err, resp){
                        
                        if(err) {
                            console.log("err refreshing token", err)

                            //_this._globalLogger(false, "App", "Error Refreshing Token", { error: err})
                            result.error = err

                        }
                        else {

                            console.log("token refreshed")

                            // if we are refreshing the token, we must reset all global state attributes back to defaults as well
                            //_this._globalStateChange( { action: "token-refresh", userData: resp.userData })
                            result.userData = resp.userData


                            //_this._globalLogger(true, "App", "Token Refreshed Successfully", { userData: resp.userData })
                            

                            // see if the user needs to see the lock screen
                            Biometrics.CheckIfShouldShowLockScreen(function(result){

                                //log = log.concat(result.log)

                                if(resp.userData.mustChangePassword ===  true) {
                                    result.forcedScreen = 'PasswordChangeRequiredStack'
                                }

                                if(result.showLock) {
                                    result.forcedScreen = 'LockStack'
                                }
                                else {
                                    // NOTE: if the user closed the app, we start back at the Dashboard
                                    // only when the app is minimized and re-opened do we worry about what screen to resume at
                                    // after biometric auth
                                    routeName = 'DrawerStack' 

                                    if(userData.mustChangePassword ===  true) {
                                        result.forcedScreen = 'PasswordChangeRequiredStack'
                                    }

                                }

                                //_this.props.screenProps._globalLogger(true, "App", "Activated", { log: result.log })

                                // redirect to the route
                                _this.doRedirect(routeName)


                            })

                        
                        } // end else

                    }) // end Authorization.RefreshToken





                } // end if userData

            }
            else {

                callback(null, { routeName: 'LoginStack' })

            } // end if data




        }) // end userData



    },






}