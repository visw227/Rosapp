
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image
} from 'react-native';

import brand from '../Styles/brand'
import AppCenter from 'appcenter'
import Push from 'appcenter-push'
import firebase from 'react-native-firebase'
import { Platform } from 'react-native'
import DeviceInfo from 'react-native-device-info'
import {updateFcmDeviceToken} from '../Services/Push'
import { OnAppLaunchOrResume } from '../Helpers/OnAppLaunchOrResume';


class LaunchScreen extends React.Component {

    // MUST BE PRESENT or NO title will appear
  static navigationOptions = {
    header: null


  }
  constructor(props) {
    super(props);

    // TESTING: client that is no longer available to the user
    // force set it here to test a client that isn't available
    //AsyncStorage.setItem('selectedClient', 'ACGTX')

    this.state = {
      FireToken : null,
      appInstallId : null

    }

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

      let _this = this


      AppCenter.setLogLevel(AppCenter.LogLevel.VERBOSE);

      this.getDeviceInfo(function(deviceInfo){

        //console.log("LaunchScreen - deviceInfo: ", JSON.stringify(deviceInfo, null, 2))

      })

      // Dywayne: commented these out on 8/15/2019 - didn't seem to be used anywhere?
      // const iosConfig = {
      //   clientId: '572559084482-tsk2t7sraufar88tlnurg2th263lig8d.apps.googleusercontent.com',
      //   appId: '1:572559084482:ios:9cfddcac43eb7f3c',
      //   apiKey: 'AIzaSyCfGVJyG03OwiMEXM7z8y_NL3Xbw39Nbd0',
      //   databaseURL: 'https://rosnet-105ca.firebaseio.com',
      //   storageBucket: 'rosnet-105ca.appspot.com',
      //   messagingSenderId: '572559084482',
      //   projectId: 'rosnet-105ca',
      
      //   // enable persistence by adding the below flag
      //   persistence: true,
      // };
      
      // // pluck values from your `google-services.json` file you created on the firebase console
      // const androidConfig = {
      //   clientId: 'x',
      //   appId: 'x',
      //   apiKey: 'x',
      //   databaseURL: 'x',
      //   storageBucket: 'x',
      //   messagingSenderId: 'x',
      //   projectId: 'x',
      
      //   // enable persistence by adding the below flag
      //   persistence: true,
      // };
      
     
      //*********************************************************
      // load all the data in storage back into the global state
      //*********************************************************
    
      OnAppLaunchOrResume.OnEvent('launch', _this.props.screenProps._globalStateChange, function(result){

        console.log("----------------------- LaunchScreen - OnAppLaunchOrResume --------------------------")
        console.log("result", result)

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
