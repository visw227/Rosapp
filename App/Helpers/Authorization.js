/*

The login stuff was moved here so that this could be shared all these things

/App-Rosnet.js (to refresh the token anytime the app moves to the foreground)
/Components/Account/Login/Index.js (to login)

Using Authorization as a namespace, which includes functions inside of it

*/


import {  AsyncStorage } from 'react-native';

import { userLogin, verifyToken } from '../Services/Account';
import { getMobileMenuItems } from '../Services/Menu';
import { Parsers } from '../Helpers/Parsers';


export var Authorization = {


    VerifyToken: function(client, token, callback) {

        // callback({ valid: true })

        //console.log(">>> VerifyToken - client: ", client, " token: ", token)
        verifyToken(client, token, function(err, resp){

            //console.log("VerifyToken - err", err, "resp", resp)
            if(err) {
                callback({ valid: false }, null)
            }
            else {
                callback(null, { valid: true })
            }
        })


    },


    // This is a workaround to create a fake API request so that subsequent requests will work
    // The first API request ALWAYS times out
    WakeUpServer: function(callback) {

        //console.log("waking up the server...")
        Authorization.UserLogin("fake", "fake", function(err, resp){

            //console.log("server has been woke up")
            if(callback) {
                callback(null, { message: "It has been woke up"})
            }
        })

    },


    RefreshToken: function(callback) {

        AsyncStorage.getItem('userData').then((data) => {

            //console.log("refreshToken loginData", data)

            if(data) {

                let userData = JSON.parse(data)

                Authorization.UserLogin(userData.userName, userData.password, function(err, resp){

                    if(err) {
                        //_this.showAlert(err.message)
                        callback( { message: err })
                    }
                    else if(resp.userData){
                        if(resp.userData) {

                            callback(null, { userData: resp.userData })

                        }
                    }
                    else {
                        callback({ message: "Unhandled Error" } )
                    }

                })
            }

        })

    },


    UserLogin: function(userName, password, callback) {

        //console.log("login", userName, password)


        let deviceInfo = null

        AsyncStorage.getItem('Viswa').then((data)=>{
            
                fcmToken = JSON.parse(data)
            
            console.log('<<<Firefcm',fcmToken)
        })
         
        AsyncStorage.getItem('deviceInfo').then((data) => {

            //console.log("refreshToken loginData", data)

            if(data) {

                deviceInfo = JSON.parse(data)

                let request = {
                    userName: userName, 
                    password: password, 
                    deviceUniqueId: deviceInfo.deviceUniqueId,
                    appInstallId: deviceInfo.appInstallId,
                    fcmDeviceToken : deviceInfo.fcmDeviceToken ? deviceInfo.fcmDeviceToken : 'null',
                    deviceType: deviceInfo.deviceType,
                    appVersion: deviceInfo.appVersion,
                    appBuild: deviceInfo.appBuild,
                    systemName: deviceInfo.systemName,
                    systemVersion: deviceInfo.systemVersion,
                    userAgent: deviceInfo.userAgent
                }

                //console.log("login request", JSON.stringify(request, null, 2))
                userLogin(request, function(err, response){        

                    if(err) {

                        //console.log("userLogin error", err)
                        // show the real error message when can - otherwise show the default message
                        //_this.showAlert("Sorry, we were unable to complete the login process. The exact error was: '" + err.message +  "'")

                        //let message = "Sorry, we were unable to complete the login process. The exact error was: '" + err.message +  "'" 
                        let message = err.message


                        callback ( { message:  message})

                    }
                    else {


                        if(response && response.SecurityToken) {

                            // this repackages the response a bit...
                            //let userData = parseUser(response)
                            let userData = Parsers.UserData(response)

                            // we are including password in the userData for the change password screen to have access the current password for validation
                            userData.password = password 
                            // only do if not level 99
                            // otherwise, it makes mine dywayne.johnson@rosnet.com when it is really djohnson@rosnet.com
                            if(userData.userLevel !== 99) {
                                userData.email = (userName).indexOf('@') !== -1 ? userName : userName+'@rosnet.com'
                            }

                            let selectedClient = ""

                            AsyncStorage.getItem('selectedClient').then((client) => {

                                // if have a selectedClient in local storage
                                if(client) {

                                    selectedClient = client

                                    // just in case the user's selected site is no longer in their list of sites
                                    // reset the selectedClient back to the first in their list
                                    // if(userData.sites.includes(selectedClient) === false && userData.sites.length > 0) {
                                    //     selectedClient = userData.sites[0]
                                    // }


                                }
                                // otherwise, default to the first site in their list
                                else {
                                    if(userData.sites.length > 0) {
                                        selectedClient = userData.sites[0]
                                    }
                                }


                                console.log("------------------------- MENU -----------------------------")
                                console.log("getting menu items for site: ", selectedClient)

                                getMobileMenuItems(selectedClient, userData.token, function(err, menuItems){
                                    

                                    if(err) {
                                        //console.log("err - getMobileMenuItems", err)

                                        let message = "Your login was successful, but we were unable to access your Rosnet menu options for " + selectedClient + "." //The exact error was: '" + err.message + "'"

                                        // go ahead and return the userData, so that the user can pick another site
                                        callback( { userData: userData, selectedClient: selectedClient, message: message } )
                                    
                                    }
                                    else {

                                        // rename the FontAwesome icons by removing the fa- preface
                                        menuItems.forEach(function(item){
                                            item.icon = item.icon.replace('fa-', '')
                                        })

                                        userData.menuItems = menuItems

                                        // return the userData and redirect if required
                                        callback(null, { userData: userData, selectedClient: selectedClient })

                                    }


                                })
                                


                            })





                        }
                        else {
                            //_this.showAlert("Invalid login request. Please check your email address and password and try again.")
                            callback( { message: "Invalid login request. Please check your email address and password and try again." })

                        }
                            

                    }


                })


            }

        })




    }




}


