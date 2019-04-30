
import {  AsyncStorage } from 'react-native';

import NavigationService from './NavigationService';

export var Biometrics = {


    CheckIfShouldShowLockScreen: function(callback) {

        let result = {
            showLock: false,
            log: []
        }

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

                if(diff >= statusData.limit) {

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

    }



}