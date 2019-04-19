
/*

https://github.com/naoufal/react-native-touch-id/issues/172

PasscodeFallback only works if the user is not enrolled in touch id/face id.


*/

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
  KeyboardAvoidingView,
  Animated,
  ScrollView,
  AsyncStorage
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
    fallbackLabel: "", // use empty string to hide "Show Passcode" when a device is FaceID or TouchID
    // iOS - ONLY allows the device to fall back to using the passcode, if faceid/touch is NOT available. 
    // this does not mean that if touchid/faceid fails the first few times it will revert to passcode, 
    // rather that if the former are not enrolled, then it will use the passcode.
    passcodeFallback: true
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
        bioType: null,
        isQA: this.props.screenProps.state.isQA
      }

  }


  componentDidMount() {


    console.log("componentDidMount...")
    

    // this will cause the biometrics challenge to display anytime this screen is displayed
    this.props.navigation.addListener('willFocus', this.load)


  }

  
  load = () => {

    console.log(">>> LOAD")
    
    // this provides shared logging via screenProps
    this.props.screenProps._globalLogger(true, "LockScreen", "Opened", {})

    TouchID.isSupported()
    .then(bioType => {
      
        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(true, "LockScreen", "Biometrics Supported", { bioType: bioType })

        this.setState({ bioType });



        // iOS: Known values: 'FaceID', T'ouchID' (finger print OR passcode), 'Null', 'None'
        if(bioType === 'FaceID' || bioType === 'TouchID') {

            this.onButtonPress()

        }
        // Android only
        else if(bioType === true) {

            this.onButtonPress()
        }
        // 'Null', 'None', etc. - if biometrics not available or disabled, just continue 
        else {

            this.onContinue()
        }


    })
    .catch(error => {

        // if there aren't any biometrics available, just take user where they were

        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(false, "LockScreen", "Biometrics Error", { error: error })

        console.log(">>> Biometrics error: ", error)

        this.onContinue()


    })


  }




    onButtonPress = () => {

        let bioType = this.state.bioType

        this.authenticate(bioType)

    }


    authenticate = (bioType) => {

        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(true, "LockScreen", "authenticate - " + bioType, { bioType: bioType })


        return TouchID.authenticate('', touchConfig)
        .then(success => {

            // this provides shared logging via screenProps
            this.props.screenProps._globalLogger(true, "LockScreen", bioType, { success: true })

            this.onContinue()

        })
        .catch(error => {
            console.log("authenticate.catch(error) = ", error)

            // this provides shared logging via screenProps
            this.props.screenProps._globalLogger(false, "LockScreen", bioType, { error: error })



        });
    }





    onContinue = () => {

        let screen = 'Dashboard'
        AsyncStorage.getItem('lastScreen').then((data) => {

            console.log('lastScreen', data)

            if(data && data !== 'LockScreen') {
                screen = data
            }

            // this should allow for the back button to appear in the header
            this.props.navigation.navigate(screen)
        

        })

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

            <View style={Styles.container}>

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


                            {/* {this.state.requestStatus.hasError &&
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
                            } */}

                            <TouchableOpacity 
                                style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                                onPress={this.onButtonPress}>
                                <Text 
                                style={ this.state.sending ? styles.buttonDisabledText : styles.buttonText }>
                                {`Authenticate with ${this.state.bioType}`}
                                </Text>
                            </TouchableOpacity> 


                            {/* <View>
                                <Text 
                                    disabled={this.state.sending} 
                                    style={styles.forgotPassword} 
                                    onPress={this.onContinue}>
                                    Or, just continue for now...
                                </Text>
                            </View> */}



                        </View>
                    </View>
            
                </View>

        ) // end return

    } // end render

} // end class


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