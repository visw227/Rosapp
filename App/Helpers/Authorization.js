/*

The login stuff was moved here so that this could be shared all these things

/App-Rosnet.js (to refresh the token anytime the app moves to the foreground)
/Components/Account/Login/Index.js (to login)

Using Authorization as a namespace, which includes functions inside of it

*/


import {  AsyncStorage } from 'react-native';

import { userLogin } from '../Services/Account';
import { getMobileMenuItems } from '../Services/Menu';
import { parseUser } from '../Helpers/UserDataParser';


export var Authorization = {


    ValidateToken: function(token, callback) {

        callback({ valid: true })

    },


    // This is a workaround to create a fake API request so that subsequent requests will work
    // The first API request ALWAYS times out
    WakeUpServer: function(callback) {

        console.log("waking up the server...")
        Authorization.UserLogin("fake", "fake", function(err, resp){
            if(callback) {
                callback(null, { message: "It has been woke up"})
            }
        })

    },


    RefreshToken: function(callback) {

        AsyncStorage.getItem('loginData').then((data) => {

            console.log("refreshToken loginData", data)

            if(data) {

                let loginData = JSON.parse(data)

                Authorization.UserLogin(loginData.userName, loginData.password, function(err, resp){

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

        console.log(">>>>> login", userName, password)

        let request = {
            userName: userName, 
            password: password, 
        }

        userLogin(request, function(err, response){        

            if(err) {

                console.log("userLogin error", err)
                // show the real error message when can - otherwise show the default message
                //_this.showAlert("Sorry, we were unable to complete the login process. The exact error was: '" + err.message +  "'")

                //let message = "Sorry, we were unable to complete the login process. The exact error was: '" + err.message +  "'" 
                let message = err.message


                callback ( { message:  message})

            }
            else {

                console.log("userLogin success:", response)

                if(response && response.SecurityToken) {

                    // this repackages the response a bit...
                    let userData = parseUser(response)
                    // we are including password in the userData for the change password screen to have access the current password for validation
                    userData.password = password 
                    userData.email = (userName).indexOf('@') !== -1 ? userName : userName+'@rosnet.com'

                    getMobileMenuItems(userData.selectedSite, userData.token, function(err, menuItems){
                        

                        if(err) {
                            console.log("err - getMobileMenuItems", err)
                                // show the real error message when can - otherwise show the default message
                            //_this.showAlert("Your login was successful, but we were unable to access your Rosnet menu options for " + userData.selectedSite + ". The exact error was: '" + err.message + "'")
                        
                            callback( { message: "Your login was successful, but we were unable to access your Rosnet menu options for " + userData.selectedSite + ". The exact error was: '" + err.message + "'" } )
                        }
                        else {

                            // rename the FontAwesome icons by removing the fa- preface
                            menuItems.forEach(function(item){
                                item.icon = item.icon.replace('fa-', '')
                            })

                            userData.menuItems = menuItems


                            // let redirect = null
                            // if(userData.mustChangePassword) {
                            //     redirect = "PasswordChangeRequiredStack"
                            // }
                            
                            //_this.onLoginResponse(userData, redirect)

                            // stringify the object before storing
                            AsyncStorage.setItem('userData', JSON.stringify(userData))

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




}


