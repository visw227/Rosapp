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

        AsyncStorage.getItem('deviceInfo').then((data) => {

            //console.log("refreshToken loginData", data)

            if(data) {

                deviceInfo = JSON.parse(data)

                let request = {
                    userName: userName, 
                    password: password, 
                    deviceUniqueId: deviceInfo.deviceUniqueId,
                    appInstallId: deviceInfo.appInstallId,
                    deviceType: deviceInfo.deviceType,
                    appVersion: deviceInfo.appVersion,
                    appBuild: deviceInfo.appBuild,
                    systemName: deviceInfo.systemName,
                    systemVersion: deviceInfo.systemVersion,
                    userAgent: deviceInfo.userAgent
                }

                console.log("login request", JSON.stringify(request, null, 2))
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

                        //console.log("userLogin success:", response)

                        if(response && response.SecurityToken) {

                            // this repackages the response a bit...
                            //let userData = parseUser(response)
                            let userData = Parsers.UserData(response)

                            // used for testing Support-Zendesk intergration
                            // if(userData.email === 'djohnson@rosnet.com') {
                            //     userData.email = 'djohnson-zendesk@rosnet.com'
                            //     userData.userId = 9999999
                            // }

                            // we are including password in the userData for the change password screen to have access the current password for validation
                            userData.password = password 
                            // only do if not level 99
                            // otherwise, it makes mine dywayne.johnson@rosnet.com when it is really djohnson@rosnet.com
                            if(userData.userLevel !== 99) {
                                userData.email = (userName).indexOf('@') !== -1 ? userName : userName+'@rosnet.com'
                            }

                            getMobileMenuItems(userData.sites[0], userData.token, function(err, menuItems){
                                

                                if(err) {
                                    //console.log("err - getMobileMenuItems", err)

                                    callback( { message: "Your login was successful, but we were unable to access your Rosnet menu options for " + userData.sites[0] + ". The exact error was: '" + err.message + "'" } )
                                }
                                else {

                                    // rename the FontAwesome icons by removing the fa- preface
                                    menuItems.forEach(function(item){
                                        item.icon = item.icon.replace('fa-', '')
                                    })

                                    userData.menuItems = menuItems

                                    // return the userData and redirect if required
                                    callback(null, { userData: userData })

                                }


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


