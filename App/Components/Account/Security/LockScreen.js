
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
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  ScrollView,
  AsyncStorage,
  TextInput,
  ActivityIndicator
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'
import DeviceInfo from 'react-native-device-info';


import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'
import Styles, {  MIN_HEIGHT, MAX_HEIGHT } from './Styles';

import TouchID from 'react-native-touch-id'

import logo from '../../../Images/logo-lg-white-square.png';
import logo_QA from '../../../Images/logo-lg-white-square-QA.png';
import logo_DEV from '../../../Images/logo-lg-white-square-DEV.png';

import NavigationService from '../../../Helpers/NavigationService';

import { Authorization } from '../../../Helpers/Authorization';


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

      const { navigation } = this.props;

      const lastScreen = navigation.getParam('lastScreen', 'DrawerStack');
      const redirectTo = navigation.getParam('redirectTo', 'DrawerStack');

      console.log("----------------------- LOCK SCREEN --------------------------")
      console.log("param lastScreen", lastScreen)
      console.log("param redirectTo", redirectTo)

      this.state = {
        receiving: false,
        requestStatus: {
            hasError: false,
            message: "",
            reRoute:false
        },
        bioType: null,
        password: null,
        passwordValid: false,
        redirectTo: redirectTo,
        lastScreen: lastScreen
      }

  }


  componentDidMount() {
    
    // componentDidMount only fires once
    // willFocus will cause the biometrics challenge to display anytime this screen is displayed
    // this will happen many times during the use of the app
    this.props.navigation.addListener('willFocus', this.load)
    
    if (Platform.OS=='ios'){
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    else{
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }


  }

    componentWillUnmount () {

        this.keyboardWillShowSub.remove();
        this.keyboardWillHideSub.remove();
    }

    keyboardWillShow = (event) => {

        this.setState({
            requestStatus: {
                hasError: false,
                message: null
            }
        })

        Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: MIN_HEIGHT,
        }).start();
    };

    keyboardWillHide = (event) => {
        Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: MAX_HEIGHT,
        }).start();
    };


    keyboardDidShow = (event) => {

        this.setState({
            requestStatus: {
                hasError: false,
                message: null
            }
        })

        Animated.timing(this.imageHeight, {
            toValue: MIN_HEIGHT,
        }).start();
    };

    keyboardDidHide = (event) => {
        Animated.timing(this.imageHeight, {
            toValue: MAX_HEIGHT,
        }).start();
    };


  load = () => {
      const {navigation} = this.props

    // clear the password in case they entered it previously when screen locked
    this.setState({
        password: null
    })
    // this provides shared logging via screenProps
    this.props.screenProps._globalLogger(true, "LockScreen", "Opened", {})
    
    const forgotPasscode = navigation.getParam('cancel', 'some default value')

    TouchID.isSupported()
    .then(bioType => {
        
        //console.log('<<LockScreen : BioType', bioType)
        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(true, "LockScreen", "Biometrics Supported", { bioType: bioType })

        // iOS: Known values: 'FaceID', T'ouchID' (finger print OR passcode), 'Null', 'None'
        if(bioType === 'FaceID' || bioType === 'TouchID') {

            this.setState({ bioType });

            this.onButtonPress()

        }
        // Android only
        else if(bioType === true) {

            this.setState({ bioType });

            this.onButtonPress()
        }
        // 'Null', 'None', etc. - if biometrics not available or disabled, just continue 
        else {

            // set to null so that user is asked to enter thier Rosnet password
            this.setState({ bioType: null }); 

        }


    })
    .catch(error => {
        // if there aren't any biometrics available, just take user where they were
       
        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(false, "LockScreen", "Biometrics Error", { error: error })

     
        //Android is not falling back to ask passcode if there is no finger print setup
        //Adding a new screen to lock the app if there is no biometric setup
        if (Platform.OS == 'android') 
        {   if (forgotPasscode !== 'true') {

            DeviceInfo.isPinOrFingerprintSet()(isPinOrFingerprintSet => {
                if (isPinOrFingerprintSet) {
                    this.props.navigation.navigate('PinCode')
                }
              });

        }
           
        }

        //console.log(">>> Biometrics error: ", error)

        // set to null so that user is asked to enter thier Rosnet password
        this.setState({ bioType: null }); 


    })


  }




    onButtonPress = () => {

        let bioType = this.state.bioType

        this.authenticate(bioType)

    }


    authenticate = (bioType) => {

        //console.log('Authenticate : BioType',bioType)
        // this provides shared logging via screenProps
        this.props.screenProps._globalLogger(true, "LockScreen", "authenticate - " + bioType, { bioType: bioType })

        
        return TouchID.authenticate('', touchConfig)
        .then(success => {

            // this provides shared logging via screenProps
            this.props.screenProps._globalLogger(true, "LockScreen", bioType, { success: true })

            this.onContinue()

        })
        .catch(error => {
            //console.log("authenticate.catch(error) = ", error)

            // this provides shared logging via screenProps
            this.props.screenProps._globalLogger(false, "LockScreen", bioType, { error: error })

            // set to null so that user is asked to enter thier Rosnet password
            this.setState({ bioType: null }); 

        });
    }





    onContinue = () => {

        let _this = this

        // let screen = 'Dashboard'
        // AsyncStorage.getItem('lastScreen').then((lastScreen) => {

        //     console.log('continuing at lastScreen', lastScreen)

           
        //     // dont get stuck on one of these screens
        //     if(lastScreen && lastScreen !== 'LockScreen' && lastScreen !== 'Login' && lastScreen !== 'ForgotPassword' && lastScreen !== 'LoginSelectClient') {
        //         screen = lastScreen
        //     }

        //     // this should allow for the back button to appear in the header
        //     if(this.state.redirectTo && this.state.redirectTo !== '') {
        //         this.props.navigation.navigate(this.state.redirectTo)
        //     }
        //     else {
        //         this.props.navigation.navigate(screen)
        //     }
        

        // })

        this.setState({
            receiving: true
        })
        // refresh the token AFTER the user sees the biometric screen
        Authorization.RefreshToken(function(err, resp){

            if(err) {

                _this.setState({
                    receiving: false
                })

                //console.log("LockScreen - RefreshToken Error:", err)
                // if error refreshing token, force back to login screen
                NavigationService.stackReset('LoginStack')

            }
            else {

                _this.setState({
                    receiving: false
                })

                //console.log("LockScreen - RefreshToken Success:", resp)

                // if we are refreshing the token, we must reset all global state attributes back to defaults as well
                _this.props.screenProps._globalStateChange({ action: "launch", userData: resp.userData } )


                if(_this.state.redirectTo && _this.state.redirectTo !== '') {
                    _this.props.navigation.navigate(_this.state.redirectTo)
                }
                else {
                    _this.props.navigation.navigate(_this.state.lastScreen)
                }
            }

        }) // end Authorization.RefreshToken


    }

    onLoginPress = () => {

        Keyboard.dismiss()

        if(this.state.password === this.props.screenProps.state.userData.password) {
            this.onContinue()
        }
        else {

            this.setState({
                requestStatus: {
                    hasError: true,
                    message: "The password is incorrect."
                }
            })
        }

    }

    onBackToLoginScreen = () => {

        // so that the user can't just close and reopen the app after being taken to the login screen,
        // null the token to really log them out
        let userData = this.props.screenProps.state.userData
        userData.token = null

        this.props.screenProps._globalStateChange( { action: "logout", userData: userData })

        NavigationService.stackReset('LoginStack')

    }

    render() {


        chooseLogo = () => {
            if(this.props.screenProps.state.config.ENV === "prod") {
                return (
                    <Animated.Image source={logo} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />

                )
            }
            else if(this.props.screenProps.state.config.ENV === "qa") {
                return (
                    <Animated.Image source={logo_QA} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />

                )
            }
            else if(this.props.screenProps.state.config.ENV === "dev") {
                return (
                    <Animated.Image source={logo_DEV} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />

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

                            {/* // show something while the token is being refreshed */}
                            {this.state.receiving &&
                                <ActivityIndicator size="large" color={brand.colors.white} />
                            }

                            <Text style={styles.message}>
                            As an extra security measure, Rosnet requires authentication using 
                            Face ID, Touch ID, passcode, or your Rosnet password.
                            </Text>
                        </View>

                        {this.state.bioType &&
                            <View style={styles.container}>

                                    <TouchableOpacity 
                                        style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                                        onPress={this.onButtonPress}>
                                        <Text 
                                        style={ this.state.sending ? styles.buttonDisabledText : styles.buttonText }>
                                        Authenticate with {this.state.bioType == true ? 'Finger Print' : this.state.bioType}
                                        </Text>
                                    </TouchableOpacity> 

                            </View>
                        }

                        {!this.state.bioType &&
                            <View style={styles.container}>

                                    <TextInput style={styles.input}   
                                            returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                                            placeholder='Password' 
                                            placeholderTextColor={brand.colors.silver}
                                            secureTextEntry
                                            value={this.state.password}
                                            onChangeText={(text) => this.setState({password: text})}
                                    />

                                    {this.state.requestStatus.hasError &&
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
                                        style={ styles.buttonContainer }
                                        onPress={this.onLoginPress}>
                                        <Text 
                                        style={ styles.buttonText }>
                                        Authenticate with Rosnet Password
                                        </Text>
                                    </TouchableOpacity> 

                                    <View>
                                        <Text 
                                            style={styles.hotlink} 
                                            onPress={this.onBackToLoginScreen}>
                                            Back to Login
                                        </Text>
                                    </View>


                            </View>
                        }

                </View>

            </KeyboardAvoidingView>

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
    },
    hotlink:{
        color: brand.colors.white,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20
    }
});

//make this component available to the app
export default LockScreen;