/*


Note: this is not in use yet. I'm trying to come up with a way to encapsulate all of the 
things that must happen when the app either launches or is resumed (changes from inactive to active)




Pseuedo code:

if NOT logged in (or first use)

    redirect to login screen

if logged in

    refresh the token
    show biometric screen if time for that
    redirect to any forced actions (e.g. required password change)






*/


import { AsyncStorage } from 'react-native';
import { Authorization } from './Authorization';

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
            forcedAction: null,
            showLock: false
        }


        OnAppLaunchOrResume.GetAllKeys(function(keys){

            let userData = null
            let routeName = null

            //console.log("LaunchScreen - userData: ", data)
            if(keys.userData === null) {

                result.forcedScreen = "LoginStack"

                return callback(null, result)


            }
            else {

                // decided this first - even if a forced action is needed like password reset, we may want to ask for biometric auth first...
                if(keys.statusData) {

                    result.statusData = keys.statusData

                    let currentTime = new Date().getTime() // in milliseconds

                    let diff = currentTime - keys.statusData.ts

                    //if(!__DEV__ && (diff >= statusData.limit || (keys.lastScreen && keys.lastScreen === 'LockScreen')) ) {
                    if( diff >= keys.statusData.limit || (keys.lastScreen && keys.lastScreen === 'LockScreen') ) {

                        result.showLock = true
                    }


                }

                //console.log("ForcedActions - keys.userData: ", keys.userData)

                if(keys.userData && keys.userData.token) {

                    result.userData = keys.userData
                    result.lastScreen = keys.lastScreen


                    // look for any forced actions for the user
                    if(keys.userData.mustChangePassword ===  true) {
                        result.forcedScreen = 'PasswordChangeRequiredStack'
                    }

                    return callback(null, result)

                } 
                else {
                    return callback(null, result)
                }

            } 

        }) // end GetAllKeys



    } 






}