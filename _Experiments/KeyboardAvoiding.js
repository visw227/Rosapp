
// 8/14/2019
// Good reference 
// https://medium.com/@nickyang0501/keyboardavoidingview-not-working-properly-c413c0a200d4

import React, { Component } from "react";
import { Button, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet,
    Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

import brand from '../App/Styles/brand'

// hide warnings for now...
console.disableYellowBox = true;


// NOTE: the backgroundColor and borderColor may be overridden when validating the new password
const strengthLevels = [
  {
    score: -1,
    label: 'Strength',
    labelColor: brand.colors.gray,
    backgroundColor: brand.colors.lightGray,
    borderColor: brand.colors.gray
  },
  {
    score: 0,
    label: 'Dangerous',
    labelColor: brand.colors.white,
    backgroundColor: brand.colors.danger,
    borderColor: brand.colors.danger
  },
  {
    score: 1,
    label: 'Weak',
    labelColor: brand.colors.white,
    backgroundColor: brand.colors.danger,
    borderColor: brand.colors.danger
  },
  {
    score: 2,
    label: 'Good',
    labelColor: brand.colors.white,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  },
  {
    score: 3,
    label: 'Strong',
    labelColor: brand.colors.white,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  },
  {
    score: 4,
    label: 'Very Strong',
    labelColor: brand.colors.white,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  }
];


class Welcome extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sending: false,
            receiving: false,
            requestStatus: {
                hasError: false,
                message: ""
            },
            isCurrentPasswordSecureText: false,
            confirmCurrentPassword: "", // make the user enter this
            securitySettings: null, 
            isNewPasswordSecureText: false,
            newPassword: '',
            newPasswordLevel: strengthLevels[0],
            newPasswordConfirmed: "",
            newPasswordScore: -1,
            isConfirmPasswordSecureText: false,
            isAcceptable: false,
            levelLabel: "",
            keyboardVisible: false
        };

    }


  componentDidMount() {
    
    
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
            keyboardVisible: true
        })

    };

    keyboardWillHide = (event) => {

        this.setState({
            keyboardVisible: false
        })
    };


    keyboardDidShow = (event) => {

        this.setState({
            keyboardVisible: true
        })

    };

    keyboardDidHide = (event) => {

        this.setState({
            keyboardVisible: false
        })

    };



    render() {
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={[{ flex: 1 }, styles.formContainer]} 
                keyboardVerticalOffset={64}
            >


            {this.state.keyboardVisible === false &&
            <Text style={[styles.title, { marginBottom: 20 } ]}>
              Rosnet has adopted Dropbox's password strength evaluation system. 
              This encourages users towards stronger passwords by asking them to type a bit more instead of demanding awkward character types. 
            </Text>
            }

                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inner}>

                            <Text style={styles.inputLabel} >New Password - Strength must be '{this.state.levelLabel}'</Text>


                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                alignContent: 'flex-start',
                            }}
                            >

                            <TextInput style={[styles.inputNewPassword, { borderColor: this.state.newPasswordLevel.borderColor }]} 
                                autoCapitalize="none" 
                                autoCorrect={false} 
                                keyboardType='default' 
                                placeholder='New Password'
                                placeholderTextColor={brand.colors.silver}
                                value={this.state.newPassword}
                                onChangeText={(text) => this.validateNewPassword(text)}
                                // these settings will allow the text to be seen until the input looses focus
                                secureTextEntry = { this.state.isNewPasswordSecureText }
                                onFocus={() => this.setState({ isNewPasswordSecureText: false })}
                                onBlur={() => this.setState({ isNewPasswordSecureText: true })}

                            />

                            <View style={[
                                styles.strengthDisplay, 
                                { 
                                    borderColor: this.state.newPasswordLevel.borderColor, 
                                    backgroundColor: this.state.newPasswordLevel.backgroundColor 
                                } 
                            ]}>
                                <Text style={[
                                { 
                                    color: this.state.newPasswordLevel.labelColor, 
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                } ]}>{this.state.newPasswordLevel.label}</Text>
                            </View>

                            </View>


                            <Text style={styles.inputLabel}>Confirm Password</Text>


                            <TextInput style={styles.input}   
                                    autoCapitalize="none"
                                    autoCorrect={false} 
                                    //returnKeyType="go"  
                                    placeholder='Confirm Password' 
                                    ref={input => { this.confirmPassInput = input }}
                                    placeholderTextColor={brand.colors.silver}
                                    value={this.state.newPasswordConfirmed}
                                    onChangeText= {(text) => this.setState({ newPasswordConfirmed: text})}
                                    // these settings will allow the text to be seen until the input looses focus
                                    secureTextEntry = { this.state.isConfirmPasswordSecureText }
                                    onFocus={() => this.setState({ isConfirmPasswordSecureText: false })}
                                    onBlur={() => this.setState({ isConfirmPasswordSecureText: true })}
                            />





                            {this.state.sending &&
                            <View style={{ marginTop: 20, marginBottom: 10 }} >
                                <ActivityIndicator size="large" color={brand.colors.primary} />
                                </View>
                            }


                            <Text style={styles.message} >
                            {this.state.requestStatus.message}
                            </Text>

                            <View style={{ flex : 1 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
    
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
    header: {
        fontSize: 36,
        marginBottom: 48,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12,
    },

    formContainer: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
      textAlign: 'center', 
      paddingTop: 5, 
      paddingLeft: 15, 
      paddingRight: 15,
      color: brand.colors.primary
    },
    input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        color: brand.colors.primary,
        borderColor: brand.colors.primary, 
        borderWidth: 1,
        borderRadius: 10
    },
    inputLabel: {
      color: brand.colors.primary,
      marginTop: 15, 
      marginLeft: 5
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 15, 
      paddingRight: 15,
      color: brand.colors.primary
    },
    inputNewPassword: {

      flexGrow: 1,
      flexBasis: 85,
      height: 40,
      backgroundColor: '#ffffff',
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      color: brand.colors.primary,
      borderColor: brand.colors.primary, 
      borderWidth: 1,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,

    },
    strengthDisplay: {

      flexGrow: 1,
      flexBasis: 15,
      height: 40,
      backgroundColor: brand.colors.lightGray,
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderColor: brand.colors.primary, 
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      maxWidth: 120

    }
});

export default Welcome;