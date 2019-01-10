//import liraries
import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    Alert, 
    StyleSheet,
    KeyboardAvoidingView,
    AsyncStorage
 } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import LoginForm from './LoginForm';

import brand from '../../../Styles/brand'
import Styles from './Styles'

// create a component
class Login extends Component {


    // MUST BE PRESENT to hide the header bar
    static navigationOptions = {

        header: null

    };


    onLoginResponse = (userData, selectedSite, menuItems, redirect) => {

        console.log("userData passed back to login screen:", JSON.stringify(userData, null, 2))

        // this shares the persisted userData to the App-Rosnet.js wrapper
        this.props.screenProps._globalStateChange( { source: "Login", userData: userData, selectedSite: selectedSite, menuItems: menuItems })

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

            // this shows a back arrow, so don't use this
            //this.props.navigation.navigate('TabStack')
            // instead, reset the navigation
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
            });
            this.props.navigation.dispatch(resetAction);

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
                    <Image resizeMode="contain" style={Styles.logo} source={require('../../../Images/logo-sm.png')} />
                </View>
                <View style={Styles.formContainer}>
                    <LoginForm 
                        onLoginResponse={this.onLoginResponse} 
                        onForgotPassword={this.onForgotPassword} 
                    />
                </View>
         
            </KeyboardAvoidingView>
        );
    }
}




//make this component available to the app
export default Login;