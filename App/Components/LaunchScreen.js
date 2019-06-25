
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import brand from '../Styles/brand'

import AppCenter from 'appcenter'
import Push from 'appcenter-push'
import firebase from 'react-native-firebase'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'

import { Biometrics } from '../Helpers/Biometrics';

import {updateFcmDeviceToken} from '../Services/Push'



class LaunchScreen extends React.Component {

    // MUST BE PRESENT or NO title will appear
  static navigationOptions = {
    header: null


  }
  constructor(props) {
    super(props);

    this.state = {
      FireToken : null,
      appInstallId : null

    }

  }

  doRedirect = (routeName) => {

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      //this.props.navigation.navigate(userToken ? 'DrawerStack' : 'LoginStack');
      // instead, reset the navigation
      const resetAction = StackActions.reset({
          index: 0,
          key: null, // this is the trick that allows this to work
          actions: [NavigationActions.navigate({ routeName: routeName })],
      });
      
      this.props.navigation.dispatch(resetAction);

  }

  getDeviceInfo = (callback) => {

      // the App Center Install ID will change on each installation, so always check on launch
      // this is async
      AppCenter.getInstallId().then(async (appInstallId) => {

        let deviceInfo = {
          appInstallId: appInstallId,
          deviceUniqueId: DeviceInfo.getUniqueID(),
          appVersion: DeviceInfo.getVersion(),
          appBuild: DeviceInfo.getBuildNumber(),
          fcmDeviceToken:this.state.FireToken,
          systemName: DeviceInfo.getSystemName(),
          systemVersion: DeviceInfo.getSystemVersion(),
          userAgent: DeviceInfo.getUserAgent(),
          pushEnabled :  Push.isEnabled(),
          deviceType: Platform.OS
        }

        this.setState({appInstallId : deviceInfo.appInstallId})

        AsyncStorage.setItem('deviceInfo', JSON.stringify(deviceInfo))

        callback(deviceInfo)

      })

  }

  componentDidMount() {

      //AsyncStorage.setItem('selectedClient', 'MAKEITBREAK')


      let _this = this


      AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);

      this.getDeviceInfo(function(deviceInfo){

        //console.log("LaunchScreen - deviceInfo: ", JSON.stringify(deviceInfo, null, 2))

      })

      const iosConfig = {
        clientId: '572559084482-tsk2t7sraufar88tlnurg2th263lig8d.apps.googleusercontent.com',
        appId: '1:572559084482:ios:9cfddcac43eb7f3c',
        apiKey: 'AIzaSyCfGVJyG03OwiMEXM7z8y_NL3Xbw39Nbd0',
        databaseURL: 'https://rosnet-105ca.firebaseio.com',
        storageBucket: 'rosnet-105ca.appspot.com',
        messagingSenderId: '572559084482',
        projectId: 'rosnet-105ca',
      
        // enable persistence by adding the below flag
        persistence: true,
      };
      
      // pluck values from your `google-services.json` file you created on the firebase console
      const androidConfig = {
        clientId: 'x',
        appId: 'x',
        apiKey: 'x',
        databaseURL: 'x',
        storageBucket: 'x',
        messagingSenderId: 'x',
        projectId: 'x',
      
        // enable persistence by adding the below flag
        persistence: true,
      };
      
     
      //*********************************************************
      // load all the data in storage back into the global state
      //*********************************************************
    
      // IMPORTANT:
      // Rehydrate the superUser object if available 
      // THIS IS ESPECIALLY important if a superUser exits/closes/terminates the app entirely.
      // Otherwise, when the superUser re-launches the app, they will still be logged in as an impersonated person
      AsyncStorage.getItem('superUser').then((superUser) => {

        console.log("superUser", superUser)

        if(superUser) {
          _this.props.screenProps._globalStateChange({ action: "launch", superUser: JSON.parse(superUser), backgroundColor: brand.colors.danger } )
        }

      })

      AsyncStorage.getItem('userData').then((data) => {

        let userData = null
        let routeName = ''

        //console.log("LaunchScreen - userData: ", data)

        if(data) {

          userData = JSON.parse(data)

          console.log("LaunchScreen - userData: ", userData)

        }

        if(userData && userData.token) {

          AsyncStorage.getItem('selectedClient').then((selectedClient) => {

            console.log("LaunchScreen - selectedClient: ", selectedClient)

            if(selectedClient) {

                // just in case the user's selected site is no longer in their list of sites
                // reset the selectedClient back to the first in their list
                if(userData.sites.includes(selectedClient) === false && userData.sites.length > 0) {
                  selectedClient = userData.sites[0]
                }

            }
            else {
              
                if(userData.sites.length > 0) {
                  selectedClient = userData.sites[0]
                }
            }


            // this shares the persisted state objects to the App-Rosnet.js wrapper
            _this.props.screenProps._globalStateChange( { action: "launch", userData: userData, selectedClient: selectedClient } )



            // see if the user needs to see the lock screen
            Biometrics.CheckIfShouldShowLockScreen(function(result){

              //log = log.concat(result.log)

              if(result.showLock) {
                routeName = 'LockStack'
              }
              else {
                // NOTE: if the user closed the app, we start back at the Dashboard
                // only when the app is minimized and re-opened do we worry about what screen to resume at
                // after biometric auth
                routeName = 'DrawerStack' 
              }

              _this.props.screenProps._globalLogger(true, "App", "Activated", { log: result.log })

              // redirect to the route
              _this.doRedirect(routeName)


            })



          })


        }
        else {

          // redirect to login
          _this.doRedirect('LoginStack')

        }


      })

      

      



  }


  // Render any loading content that you like here
  render() {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../Images/ajax-loader.gif')} />
        <StatusBar barStyle="default" />
      </View>
    );

  }
}


//make this component available to the app
export default LaunchScreen;
