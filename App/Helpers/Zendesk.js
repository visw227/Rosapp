

import { registerUser, getRequests, searchUsersByEmail, reportIssue } from '../Services/Support'
import { getTensorSessionInfo } from '../Services/TensorSession'

//import async from 'async'
var waterfall = require('async-waterfall');

export var Zendesk = {


    GetRequests: function(userData, client, token, callback) {

        console.log("GetRequests")
      

       waterfall([

            
            // get the TensorSession data
            function(callback){

                console.log("getTensorSessionInfo...")

                getTensorSessionInfo(client, token, function(err, session){

                    if(err) {
                        let error = { step: 'getTensorSessionInfo', error: err }
                        console.log("getTensorSessoinInfo error!", error)
                        callback(error, null)
                    }
                    else {

                        console.log("getTensorSessoinInfo success!", session)

                        callback(null, session)

                    }

                })

            },

            // see if the user exists in Zendesk by their ZendeskEmail address
            function(session, callback){

                console.log("searchUsersByEmail...")

                searchUsersByEmail(client, token, session.ZendeskEmail, function(err, resp){

                    if(err) {
                        let error = { step: 'searchUsersByEmail', error: err }
                        console.log("searchUsersByEmail error!", error)
                        callback(error, null)
                    }
                    else {

                        console.log("searchUsersByEmail success!", resp)

                        // if they exist, get their Zendesk requests 
                        if(resp && resp.users && resp.users.length > 0) {

                            console.log("searchUsersByEmail FOUND user", resp)

                            callback(null, session, null)

                        }
                        // if they weren't found, try to register them silently unless we need them to enter an email address
                        else {

                            console.log("searchUsersByEmail NOT found!", resp)

                            // we need to ask them to enter an email address
                            if(session.ZendeskEmail === '') {

                                let error = { step: 'searchUsersByEmail', missingEmail: true }

                                console.log("searchUsersByEmail need email address")

                                callback(error, null)

                            }
                            // quietly register their email address THEN return their requests (which will be an empty list)
                            else {


                                // try to register the user with Zendesk...
                                Zendesk.RegisterUser(userData, client, token, session, function(err, resp){

                                    if(err) {

                                        let error = { step: 'register user', error: err }

                                        console.log("Zendesk.RegisterUser error!", error)

                                        callback(error, null)
                                    }
                                    else {

                                        console.log("Zendesk.RegisterUser success!", resp)

                                        // get their requests (which will be an empty list)
                                        callback(null, session, resp)
                                    }

                                })

    
                            }

                        }

                    }

                })

            },

            // if they exist, get their Zendesk requests otherwise register them quietly unless we need them to enter an email address
            function(session, newUserResp, callback){

                getRequests(client, token, session.ZendeskEmail, function(err, resp){

                    if(err) {
                        let error = { step: 'getRequests', error: err }
                        
                        console.log("getRequests error!", error)

                        callback(error, null)
                    }
                    else {

                        console.log("getRequests success!", resp)

                        callback(null, resp.requests)

                    }

                })

            },



            ], function (err, resp) {
                if(err) {
                    console.log(">>>>> FINAL ERROR:", err)
                    callback(err, null)
                }
                else {
                    console.log(">>>>> FINAL RESPONSE:", resp)
                    callback(null, resp)
                }
            }

        ) //end async waterfall

    }, // end GetRequests


    RegisterUser: function(userData, client, token, session, callback) {

        let request = {
            rosnet_user_id : session.RosNetUserId,
            email : session.ZendeskEmail,
            name: session.ZendeskFullName,
            location : userData.location || 0 // this the login result Browse_Linkto_Location
        }

        registerUser(client, token, request, function(err, resp){

            if(err){

                console.log('errror creating Zendesk user',err)

                let alreadyExists = false
                if(err.message.indexOf("422") !== -1) {
                    // This email address has already been registered.
                    alreadyExists = true
                }

                let error = { step: 'registerUser', alreadyExists: alreadyExists, message: err.message }
                callback(error, null)


            }
            else {
                console.log('user added successfully')

                callback(null, resp)

            

            }

        })



    }, // end RegisterUser


    ReportIssue: function(client, token, request, callback) {

        reportIssue (client, token, request, function(err, resp){
            if(err){
                console.log('errror reporting Issue',err)

                callback(err, null)


            }
            else {
                console.log('issue reported successfully')

                callback(null, resp)

            }
        })



    } // end ReportIssue





}
