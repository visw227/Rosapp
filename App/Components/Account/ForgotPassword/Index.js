import React from 'react'
import { 
    View, 
    Image,
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    Button, 
    StyleSheet, 
    StatusBar,
    AsyncStorage,
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Animated,
    Platform,
    ScrollView
 } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../../../Styles/brand'

import Styles, {  MIN_HEIGHT, MAX_HEIGHT } from './Styles';
import logo from '../../../Images/logo-lg-white-square.png';
import logo_QA from '../../../Images/logo-lg-white-square-QA.png';
import logo_DEV from '../../../Images/logo-lg-white-square-DEV.png';

import { forgotPassword } from '../../../Services/Account';

export class ForgotPassword extends React.Component {

    static navigationOptions = {

        header: null

    };

    constructor(props) {
        super(props);
        
        this.imageHeight = new Animated.Value(MAX_HEIGHT);

        this.state = {
            sending: false,
            receiving: false,
            requestStatus: {
                hasError: false,
                message: ""
            },
            email: '',
            password: '',
            userData: null
        }

    }

  componentDidMount () {


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

    showAlert = (message) => {

        console.log("error message: ", message)

        this.setState({
            sending: false, 
            requestStatus: {
                hasError: true,
                message: message
            }
        })

    }


    onBackToLogin = () => {

        // this should allow for the back button to appear in the header
        this.props.navigation.navigate('Login')

    }


    onSendResetLinkPress = () => {

        // this takes on a new scope inside of the userLogin and getUserLogin callback, so make a copy
        let _this = this

        // for some reason, this doesn't work for all scenarios below, but calling it within each scenario works
        Keyboard.dismiss()

        // input validation
        if(this.state.email === '') {

          this.setState({
            sending: false,
            requestStatus: {
                hasError: true,
                message: 'Please enter your email address'
            }
          })

          return
        }

        this.setState({
            sending: true,
            requestStatus: {
                hasError: false,
                message: null
            }
        })


        console.log("submitting...", this.state.email)

        let request = {
          email: this.state.email
        }


        forgotPassword(request, function(err, resp){

          if(err) {

            _this.setState({
                sending: false,
                requestStatus: {
                    hasError: true,
                    message: err.message
                }
            })

          }
          else {
            
            _this.setState({
                sending: false,
                requestStatus: {
                    hasError: true,
                    message: resp
                }
            })

          }

        })


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
                        <Text style={{color: brand.colors.white }}>If you have forgotten your password we can send you a link to reset it.</Text>
                    </View>

                    <View style={styles.container}>
                        <StatusBar barStyle="light-content"/>
                        <TextInput style={styles.input} 
                                    autoCapitalize="none" 
                                    //onSubmitEditing={() => this.passwordInput.focus()} 
                                    autoCorrect={false} 
                                    keyboardType='email-address' 
                                    returnKeyType="next" 
                                    placeholder='Email Address'
                                    placeholderTextColor={brand.colors.silver}
                                    value={this.state.email}
                                    onChangeText={(text) => this.setState({email: text})}
                        />


                        {this.state.sending &&
                        <View style={{ marginTop: 10, marginBottom: 10 }} >
                            <ActivityIndicator size="large" color={brand.colors.white} />
                            </View>
                        }


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


                            <TouchableOpacity disabled={this.state.sending} 
                                style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                                onPress={this.onSendResetLinkPress}>
                                <Text  style={ this.state.sending ? styles.buttonDisabledText   : styles.buttonText }>Send Password Reset Link</Text>
                            </TouchableOpacity> 

                        <View>
                            <Text 
                                disabled={this.state.sending} 
                                style={styles.forgotPassword} 
                                onPress={this.onBackToLogin}>
                                Back to Login
                            </Text>
                        </View>
                    </View>
                </View>
         
            </KeyboardAvoidingView>
    )
  }
}

// define your styles
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
    }
   
});

//make this component available to the app
export default ForgotPassword;