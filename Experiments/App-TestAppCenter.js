
import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import { AppCenter } from 'appcenter'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'

// hide warnings for now...
console.disableYellowBox = true;

class Test extends React.Component {


    constructor(props) {
        super(props);

        this._bootstrapAsync()

    }

    // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {


        // await AppCenter.setEnabled(true);

        // const sdkVersion = AppCenter.getSdkVersion();

        console.log("Platform.OS", Platform.OS)

        let deviceType = Platform.OS.toUpperCase() === 'ANDROID'? 1 : Platform.OS.toUpperCase() === 'IOS' ? 2 : 0
        console.log("deviceType", deviceType)

        try {
            console.log("DeviceInfo.getUniqueID()", DeviceInfo.getUniqueID())
        }
        catch(e) {
            console.log("error getting device id:", e)
        }

        try {
            const installId = await AppCenter.getInstallId();
            console.log("AppCenter.getInstallId()", installId)
        }
        catch(e) {
            console.log("error getting app install id:", e)
        }


        //https://docs.microsoft.com/en-us/appcenter/sdk/other-apis/react-native#identify-installations
        //https://github.com/Microsoft/AppCenter-SDK-React-Native/issues/407

  };


  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello!</Text>
      </View>
    );
  }
}



export default Test