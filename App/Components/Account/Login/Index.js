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
    Platform
 } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import { userLogin } from '../../../Services/Account';
import { getMobileMenuItems } from '../../../Services/Menu';

import brand from '../../../Styles/brand'
import Styles, {  MIN_HEIGHT, MAX_HEIGHT } from './Styles';

let fakedMenu = require('../../../Fixtures/Modules')

import logo from '../../../Images/logo-lg-white-square.png';

import { parseUser } from '../../../Helpers/UserDataParser';

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
            userName: 'dywayne.johnson',
            password: 'gorosnet1$',
            userData: null
        }

    }
    
    componentDidMount() {

        // this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        // this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

        // clear any abandoned keys
        // let keys = ['userEmail', 'userPassword'];
        // AsyncStorage.multiRemove(keys, (err) => {
        //     // do most stuff after removal (if you want)
        // });

        AsyncStorage.getItem('userData').then((data) => {

            console.log("LoginForm userData", data)

            if(data) {
                
                let userData = JSON.parse(data)

                //console.log("userData", JSON.stringify(userData, null, 2))

                this.setState({
                    userName: userData.userName,
                    password: userData.password,
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

        // for some reason, this doesn't work for all scenarios below, but calling it within each scenario works
        Keyboard.dismiss()

        // this takes on a new scope inside of the userLogin and getUserLogin callback, so make a copy
        let _this = this

        this.setState({
            sending: true,
            requestStatus: {
                hasError: false,
                message: null
            }
        })

        // AsyncStorage.setItem('userEmail', this.state.email)
        // AsyncStorage.setItem('userPassword', this.state.password)

        console.log("submitting...", this.state.userName, this.state.password)

        let request = {
			userName: this.state.userName, 
			password: this.state.password, 
        }
        

        if(this.state.userName === 'demo') {

            // FAKED for demoing...
            setTimeout(() => {
        
                const FAKE_TOKEN = 'FAKE-ABCD-1234'

                let userData = {
                    token: FAKE_TOKEN,
                    userId: 0,
                    userName: this.state.userName,
                    commonName: "Demo User",
                    password: this.state.password,
                    sites: [ "AAG", "DOHERTY" ],
                    isRosnetEmployee: false,
                    selectedSite: "AAG",
                    menuItems: JSON.stringify(fakedMenu)
                }

                AsyncStorage.setItem('userData', JSON.stringify(userData))
                

            }, 1000);

        }
        else {

            // real login request
            userLogin(request, function(err, response){        

                if(err) {

                    console.log("userLogin error", err)
                    _this.showAlert(err.message)

                }
                else {

                    console.log("userLogin success:", response)

                    if(response && response.SecurityToken) {

                        // this repackages the response a bit...
                        let userData = parseUser(response)

                        getMobileMenuItems(userData.selectedSite, userData.token, function(err, menuItems){
                            
                            if(err) {
                                console.log("err - getMobileMenuItems", err)
                                _this.showAlert(err.message)
                            }
                            else {

                                // rename the FontAwesome icons by removing the fa- preface
                                menuItems.forEach(function(item){
                                    item.icon = item.icon.replace('fa-', '')
                                })

                                userData.menuItems = menuItems


                                _this.setState({
                                    sending: false
                                })
                                _this.onLoginResponse(userData, null)

                                // stringify the object before storing
                                AsyncStorage.setItem('userData', JSON.stringify(userData))


                            }
                        })


                    }
                    else {
                        _this.showAlert("Invalid login request. Please check your email address and password and try again.")

                    }
                        

                }

                _this.setState({
                    sending: false
                })

            })

        }




    }



    onLoginResponse = (userData, redirect) => {

        console.log("userData passed back to login screen:", JSON.stringify(userData, null, 2))

        // this shares the persisted userData to the App-Rosnet.js wrapper
        this.props.screenProps._globalStateChange( { source: "Login", action: "login", userData: userData })

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
        this.props.navigation.navigate('ForgotPassword')

    }

    render() {
        return (
            
            <KeyboardAvoidingView behavior="padding" style={Styles.container}>

                <View style={Styles.loginContainer}>
                    <Animated.Image source={logo} style={[Styles.logo, { height: this.imageHeight, maxHeight: this.imageHeight, maxWidth: this.imageHeight }]} />
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
                                    placeholder='Email Address'
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
                                <Text style={{color: 'white' }}>{this.state.requestStatus.message}</Text>
                            </View>
                        }

                        <TouchableOpacity disabled={this.state.sending} 
                            style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                            onPress={this.onLoginPress}>
                            <Text  style={styles.buttonText}>LOGIN</Text>
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
    buttonDisabledContainer:{
        backgroundColor: brand.colors.primary,
        opacity: .5,
        paddingVertical: 15,
        borderRadius: 30
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
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