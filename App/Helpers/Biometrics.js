
import {  AsyncStorage } from 'react-native';

import NavigationService from './NavigationService';

export var Biometrics = {


    CheckIfShouldShowLockScreen: function(callback) {

        let result = {
            showLock: false,
            log: []
        }


        // make sure the user didn't force-close the app when the LockScreen was displayed
        AsyncStorage.getItem('lastScreen').then((lastScreen) => {

            console.log('continuing at lastScreen', lastScreen)

           



            // see if the user needs to see the lock screen
            AsyncStorage.getItem('statusData').then((data) => {

                if(data) {

                    let statusData = JSON.parse(data)
                    let currentTime = new Date().getTime() // in milliseconds

                    let diff = currentTime - statusData.ts

                    result.log.push({
                        action: "Checking statusData",
                        details: { 
                        currentTime: currentTime, 
                        statusData: statusData,
                        diff: diff
                        }
                    })

                    // check if limit was exceeded or if lastScreen was the LockScreen (and the user force-closed the app when LockScreen was shown)
                    // if the app is in debug-mode or on simulator , the locakscreen is bypassed (for dev convinience)

                    if(!__DEV__ && (diff >= statusData.limit || lastScreen === 'LockScreen') ) {

                        result.log.push({
                            action: "Showing Lock Screen",
                            details: null
                        })

                        // this is needed since props.navigation isn't present for unmounted screen components
                        //NavigationService.navigate('LockStack');
                        result.showLock = true
                    }

            
                    else {

                        result.log.push({
                            action: "NOT Showing Lock Screen",
                            details: null
                        })

                    }



                }

                //console.log("SHOW LOCK", JSON.stringify(result, null, 2))

                callback(result)

            }) // end AsyncStorage
       
        

        })




    }



}