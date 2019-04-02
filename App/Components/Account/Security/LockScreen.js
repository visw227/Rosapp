
// FaceID is not available in Expo Client. You can us…Expo app by providing `NSFaceIDUsageDescription

import React, { Component } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableHighlight,
  Alert, 
  Platform, 
  Image, 
  AlertIOS,
  KeyboardAvoidingView,
  Animated,
  ScrollView
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'
import Styles, {  MIN_HEIGHT, MAX_HEIGHT } from './Styles';

import TouchID from 'react-native-touch-id'

import logo from '../../../Images/logo-lg-white-square.png';
import logo_QA from '../../../Images/logo-lg-white-square-QA.png';

//config is optional to be passed in on Android
const touchConfig = {
  title: "Authentication Required", // Android
  color: "#e00606", // Android,
  fallbackLabel: "Show Passcode" // iOS (if empty, then label is hidden)
}


class LockScreen extends React.Component {


  static navigationOptions = (navigate) => ({

    header: null

  })

  constructor(props) {
      super(props);

      this.imageHeight = new Animated.Value(MAX_HEIGHT);

      this.state = {

        requestStatus: {
            hasError: false,
            message: ""
        },
        hasHardwareAsync: false,
        isEnrolledAsync: false, 
        authenticateAsync: false,
        compatible: false,
        fingerprints: false,
        result: '',
        biometryType: null,
        isQA: this.props.screenProps.state.isQA
      }

  }


  componentDidMount() {

    // this.checkDeviceForHardware();
    // this.checkForFingerprints();

    TouchID.isSupported()
    .then(biometryType => {
      this.setState({ biometryType });
    })
  }


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
  


  clickHandler = () => {
    TouchID.isSupported()
      .then(this.authenticate)
      .catch(error => {
        console.log("error", error)
        //AlertIOS.alert('TouchID not supported');
        this.showAlert("TouchID not supported")
      });
  }

  authenticate = () => {
    return TouchID.authenticate()
      .then(success => {
        //AlertIOS.alert('Authenticated Successfully');

         this.showAlert("Authenticated Successfully")
      })
      .catch(error => {
        console.log("authenticate.catch(error) = ", error)
        //AlertIOS.alert(error.message);
        this.showAlert("Authentication error: " + error)
      });
  }


  showAlert = (message) => {


    this.setState({
        sending: false, 
        requestStatus: {
            hasError: true,
            message: message
        }
    })

}


    onContinue = () => {

        // this should allow for the back button to appear in the header
        this.props.navigation.navigate('Dashboard')

    }

  render() {


    chooseLogo = () => {
        if(this.state.isQA) {
            return (
                <Animated.Image source={logo_QA} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />

            )
        }
        else {
            return (
                <Animated.Image source={logo} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />

            )
        }
    }


    return (
          <KeyboardAvoidingView behavior="padding" style={Styles.container}>

                <View style={Styles.logoContainer}>
                    {/* <Animated.Image source={logo} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} /> */}
                    {chooseLogo()}
                </View>


                <View style={Styles.formContainer}>

                    <View style={{ 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        margin: 20,
                        fontSize: 25,
                        textAlign: 'center'
                    }}>
                        <Text style={styles.message}>
                          As an extra security measure, Rosnet requires authentication using 
                          Face ID, Touch ID, or your device passcode.
                        </Text>
                    </View>

                    <View style={styles.container}>


                        {!this.state.sending && this.state.requestStatus.hasError &&
                            <View style={{ 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginBottom: 15,
                                marginTop: 10
                            }}>
                                <ScrollView style={{ marginTop: 0, height: 70, paddingLeft: 10, paddingRight: 10 }}>
                                    <Text style={{color: 'white' }}>{this.state.requestStatus.message}</Text>
                                </ScrollView>
                            </View>
                        }

                        <TouchableOpacity 
                            style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                            onPress={this.clickHandler}>
                            <Text 
                              style={ this.state.sending ? styles.buttonDisabledText : styles.buttonText }>
                              {`Authenticate with ${this.state.biometryType}`}
                            </Text>
                        </TouchableOpacity> 


                        <View>
                            <Text 
                                disabled={this.state.sending} 
                                style={styles.forgotPassword} 
                                onPress={this.onContinue}>
                                Or, just continue for now...
                            </Text>
                        </View>



                    </View>
                </View>
         
            </KeyboardAvoidingView>

    )

  }

}


const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        padding: 10,
        color: brand.colors.primary,
        borderColor: brand.colors.primary, 
        borderWidth: 1,
        borderRadius: 10
    },
    buttonContainer:{
        marginTop: 20,
        backgroundColor: brand.colors.primary,
        paddingVertical: 15,
        borderRadius: 30,
        borderColor: brand.colors.white, 
        borderWidth: 2,
    },
    buttonText:{
        color: 'white',
        textAlign: 'center',
        fontWeight: '700'
    }, 
    buttonDisabledContainer:{
        marginTop: 20,
        backgroundColor: brand.colors.primary,
        paddingVertical: 15,
        borderRadius: 30,
        borderColor: brand.colors.white, 
        borderWidth: 2,
        opacity: .1
    },
    buttonDisabledText:{
        color: 'white',
        textAlign: 'center',
        fontWeight: '700',
        opacity: .8
    }, 
    loginButton:{
        backgroundColor:  brand.colors.secondary,
        color: '#fff'
    },
    forgotPassword:{
        color: brand.colors.white,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 10, 
      paddingRight: 10,
      color: brand.colors.white,
      fontSize: 15
    }
   
});

//make this component available to the app
export default LockScreen;