/*

The login stuff was moved here so that this could be shared all these things

/App-Rosnet.js (to refresh the token anytime the app moves to the foreground)
/Components/Account/Login/Index.js (to login)

Using Authorization as a namespace, which includes functions inside of it

*/


import {  AsyncStorage } from 'react-native';
import moment from 'moment'

const MAX_LOG_ENTRIES = 100

export var Logger = {


    LogEvent: function(ok, source, title, message) {

        //console.log("$$$ LogEvent - source: ", source, ", title: ", title, ", message", message)
        

        Logger.GetEvents(function(logData){

            let event = { 
                ok: ok, 
                source: source, 
                title: title, 
                message: message, 
                ts: new Date().getTime() // add a timestamp to it for sorting
            }


            logData.push(event)

            AsyncStorage.setItem('logData', JSON.stringify(logData))

        })

    },


    GetEvents: function(callback) {

         AsyncStorage.getItem('logData').then((data) => {

            let arr = []

            if(data) {
                
                arr = JSON.parse(data)

                // keep the logData storage item light - ONLY keep 100 or so (TBD)
                arr.splice(0, arr.length - MAX_LOG_ENTRIES);

                //console.log("### logData: ", JSON.stringify(arr, null, 2))

            }


            callback(arr)

        })
        
    },

    DeleteAllEvents: function() {

        AsyncStorage.setItem('logData', JSON.stringify([]))

    }


}