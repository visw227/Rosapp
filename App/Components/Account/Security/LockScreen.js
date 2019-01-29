
// FaceID is not available in Expo Client. You can us…Expo app by providing `NSFaceIDUsageDescription

import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Platform, Image } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'



class LockScreen extends React.Component {


  static navigationOptions = (navigate) => ({

    header: null

  })

  constructor(props) {
      super(props);

      this.state = {
        hasHardwareAsync: false,
        isEnrolledAsync: false, 
        authenticateAsync: false,
        compatible: false,
        fingerprints: false,
        result: ''
      }

  }


  componentDidMount() {

    // this.checkDeviceForHardware();
    // this.checkForFingerprints();
  }
  
  // checkDeviceForHardware = async () => {
  //   let hasHardwareAsync = await Expo.LocalAuthentication.hasHardwareAsync();
  //   this.setState({hasHardwareAsync})

  //   console.log("hasHardwareAsync", hasHardwareAsync)
  // }
  
  // checkForFingerprints = async () => {
  //   let isEnrolledAsync = await Expo.LocalAuthentication.isEnrolledAsync();
  //   this.setState({isEnrolledAsync})

  //   console.log("isEnrolledAsync", isEnrolledAsync)
  // }
  
  // getTouchFaceOrPasscode = async () => {
  //   let result = await Expo.LocalAuthentication.authenticateAsync('Scan your finger.');
  //   console.log('Authentication Result:', result)

  //   if(result.success) {
  //     this.letsContinue()
  //   }
  // }

  letsContinueForNow = () => {

    const resetAction = StackActions.reset({
        index: 0,
        key: null, // this is the trick that allows this to work
        actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
    });
    this.props.navigation.dispatch(resetAction);

  }
  
  showAlert = () => {
    Alert.alert(
      'Face, Fingerprint, or Passcode?',
      'Place your finger over the touch sensor and press scan. FaceID is not available in Expo Client.',
      [
        {text: 'Continue', onPress: () => {
          this.getTouchFaceOrPasscode();
        }},
        {text: 'Cancel', onPress: () => console.log('Cancel'), style: 'cancel'}
      ]
    )
  }
  
  render() {
    return (
      <View style={styles.container}>


        <Image resizeMode="contain" style={styles.logo} source={require('../../../Images/logo-sm.png')} />
  
        <Text style={styles.text}>
          As an extra security measure, please press 'Continue' to access Rosnet using Face ID, Touch ID or your device passcode.
        </Text>

        <TouchableOpacity onPress={this.letsContinueForNow} style={styles.button}>
          <Text style={styles.buttonText}>
            Continue
          </Text>
        </TouchableOpacity>

        <Text style={{ fontSize: 12, textAlign: 'center' }}>
          hasHardwareAsync: {this.state.hasHardwareAsync === true ? 'True' : 'False' }, 
          isEnrolledAsync: {this.state.isEnrolledAsync === true ? 'True' : 'False'}
        </Text>

      </View>
    );
  }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    backgroundColor: brand.colors.white,
    paddingLeft: 40,
    paddingRight: 40
  },
    logoContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        // position: 'absolute',
        // width: 400,
        // height: 200
    },
  text: {
    fontSize: 18,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 50,
    backgroundColor: '#056ecf',
    borderRadius: 5
  },
  buttonText: {
    fontSize: 25,
    color: '#fff'   
  }
});


//make this component available to the app
export default LockScreen;