//import liraries
import React, { Component } from 'react';
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

import { NavigationActions, StackActions } from 'react-navigation'

import { Authorization } from '../../../Helpers/Authorization';

import brand from '../../../Styles/brand'
import Styles, {  MIN_HEIGHT, MAX_HEIGHT } from './Styles';

let fakedMenu = require('../../../Fixtures/Modules')

import logo from '../../../Images/logo-lg-white-square.png';
import logo_QA from '../../../Images/logo-lg-white-square-QA.png';


// create a component
class Login extends Component {


    // MUST BE PRESENT to hide the header bar
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
            userName: '',
            password: '',
            userData: null,
            isQA: this.props.screenProps.state.isQA
        }

    }
    
    componentDidMount() {

        let _this = this


        AsyncStorage.getItem('loginData').then((data) => {

            //console.log("LoginForm loginData", data)

            if(data) {

                let loginData = JSON.parse(data)

                _this.setState({
                    userName: loginData.userName,
                    password: '' //loginData.password
                })
            }

        })


        AsyncStorage.getItem('userData').then((data) => {

            //console.log("LoginForm userData", data)

            if(data) {
                
                let userData = JSON.parse(data)

                //console.log("userData", JSON.stringify(userData, null, 2))

                this.setState({
                    // userName: userData.userName,
                    // password: userData.password,
                    userData: userData
                })
            }

        })

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


    //******************************************************************
    // this will pass results back up to Login.js
    //******************************************************************
    onLoginPress = () => {

        // this takes on a new scope inside of the userLogin and getUserLogin callback, so make a copy
        let _this = this

        // for some reason, this doesn't work for all scenarios below, but calling it within each scenario works
        Keyboard.dismiss()

        if(this.state.userName === '' || this.state.password === '') {
            _this.showAlert("Please enter your user name and password.")
            return
        }

        this.setState({
            sending: true,
            requestStatus: {
                hasError: false,
                message: null
            }
        })


        console.log("submitting...", this.state.userName, this.state.password)

        let request = {
			userName: this.state.userName, 
			password: this.state.password, 
        }
        
        // keep this around for later uses like auto-re-login to make sure user is still active and/or has same client locations
        AsyncStorage.setItem('loginData', JSON.stringify( { userName: this.state.userName, password: this.state.password }))


        if(this.state.userName === 'demo') {

            // FAKED for demoing...
            setTimeout(() => {
        
                const FAKE_TOKEN = 'FAKE-TOKEN'

                let userData = {
                    token: FAKE_TOKEN,
                    userId: 0,
                    userName: this.state.userName,
                    commonName: "Demo User",
                    password: this.state.password,
                    sites: [ "AAG", "DOHERTY" ],
                    isRosnetEmployee: false,
                    menuItems: fakedMenu,
                    isRosnetEmployee: true,
                    mustChangePassword: true,
                    canChangePassword: true
                }

                let redirect = null
                if(userData.mustChangePassword) {
                    redirect = "PasswordChangeRequiredStack"
                }
                
                _this.onLoginResponse(userData, redirect)

                _this.setState({
                    sending: false
                })

            }, 1000);

        }
        else {


            // this provides shared logging via screenProps
            this.props.screenProps._globalLogger(true, "Login", "Attempt", { userName: this.state.userName, password: "******" })


            Authorization.UserLogin(this.state.userName, this.state.password, function(err, resp){

                if(err) {
                    _this.showAlert(err.message)

                    // this provides shared logging via screenProps
                    _this.props.screenProps._globalLogger(false, "Login", "Error", err)


                }
                else if(resp.userData){
                    if(resp.userData) {

                        // this provides shared logging via screenProps
                        _this.props.screenProps._globalLogger(true, "Login", "Successful", resp)


                        let redirect = null
                        if(resp.userData.mustChangePassword) {
                            redirect = "PasswordChangeRequiredStack"
                        }


                        _this.onLoginResponse(resp.userData, redirect)

                    }
                }
                else {
                    _this.showAlert("Unhandled Error")
                }

            })

        }




    }



    onLoginResponse = (userData, redirect) => {

        //console.log("userData passed back to login screen:", JSON.stringify(userData, null, 2))

        // this shares the persisted userData to the App-Rosnet.js wrapper
        this.props.screenProps._globalStateChange( { action: "login", userData: userData })


        AsyncStorage.getItem('selectedClient').then((selectedClient) => {

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

            // tell everyone listening about the selectedClient
            this.props.screenProps._globalStateChange( { action: "login", selectedClient: selectedClient })

        })

        if(redirect) {

            // this shows a back arrow, so don't use this
            //this.props.navigation.navigate('TabStack')
            // instead, reset the navigation
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: redirect })],
            });
            this.props.navigation.dispatch(resetAction);

        }
        else if(userData && userData.token) {

            let stackName = 'DrawerStack'

            // check this setting before deciding where to go next...
            AsyncStorage.getItem('askedToSendPushNotifs').then((asked) => {

                console.log("askedToSendPushNotifs", asked)

                if(!asked) {
                    stackName = 'PushNotificationsPermissionStack' 
                }

                // this shows a back arrow, so don't use this
                //this.props.navigation.navigate('TabStack')
                // instead, reset the navigation
                const resetAction = StackActions.reset({
                    index: 0,
                    key: null, // this is the trick that allows this to work
                    actions: [NavigationActions.navigate({ routeName: stackName })],
                });
                this.props.navigation.dispatch(resetAction);

            })

        }

    }

    onForgotPassword = () => {

        // this should allow for the back button to appear in the header
        this.props.navigation.navigate('ForgotPassword', { userName: this.state.userName })

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
                    <View style={styles.container}>
                        <StatusBar barStyle="light-content"/>
                        <TextInput style={styles.input} 
                                    autoCapitalize="none" 
                                    onSubmitEditing={() => this.passwordInput.focus()} 
                                    autoCorrect={false} 
                                    keyboardType='email-address' 
                                    returnKeyType="next" 
                                    placeholder='User Name or Email Address'
                                    placeholderTextColor={brand.colors.silver}
                                    value={this.state.userName}
                                    onChangeText={(text) => this.setState({userName: text})}
                        />

                        <TextInput style={styles.input}   
                                returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                                placeholder='Password' 
                                placeholderTextColor={brand.colors.silver}
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(text) => this.setState({password: text})}
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
                                onPress={this.onLoginPress}>
                                <Text  style={ this.state.sending ? styles.buttonDisabledText   : styles.buttonText }>LOGIN</Text>
                            </TouchableOpacity> 

                        <View>
                            <Text 
                                disabled={this.state.sending} 
                                style={styles.forgotPassword} 
                                onPress={this.onForgotPassword}>
                                Forgot password?
                            </Text>
                        </View>
                    </View>
                </View>
         
            </KeyboardAvoidingView>
        );
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
export default Login;