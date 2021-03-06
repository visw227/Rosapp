import React from 'react';
import { 
  View, 
  Image,
  Text, 
  TextInput, 
  TouchableOpacity,
  TouchableHighlight,
  Alert, 
  Button, 
  StyleSheet, 
  ScrollView,
  StatusBar,
  AsyncStorage,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
import { NavigationActions, StackActions } from 'react-navigation'
//import Entypo from 'react-native-vector-icons/Entypo'

import _ from 'lodash'
import zxcvbn from 'zxcvbn'
import brand from '../../../Styles/brand'

import { changePassword,userLogin } from '../../../Services/Account';
import { getSecuritySettings} from '../../../Services/Site';
import AlerMessage from '../../Modules/AlertMessage'


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



class Password extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Change Password',

    // these seem to ONLY work here
    headerStyle: { backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    

    headerRight : 
          <View style={{
            alignItems: 'center',
            flexDirection: 'row',
            height: 40,
            paddingRight: 10,
            width: '100%'
          }}>
            <Text 
              style={{ color: 'white', fontSize: 16 }}
              onPress={navigate.navigation.getParam('handleSubmit')} >
              Save
              </Text>
          </View>

  })

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
  
  componentWillMount () {

    this.setState({
      validated : false,
      unValidated : true,
      passwordConfirmed : false

    })

    console.log('userDate',this.props.screenProps.state.userData)

  }

  componentDidMount () {

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit,
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    _this = this

    if (Platform.OS=='ios'){
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    else{
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

    getSecuritySettings (this.props.screenProps.state.selectedClient, userData.token, function(err, resp) {

      if (err){
        console.log ('error receiving security settings',err)
      }
      else {

        console.log("security settings", resp)

        let level = strengthLevels.find(function(item){
            return item.score === resp.Pswd_Complexity
        })

        let levelLabel = ""
        if(level) {
          levelLabel = level.label
        }

        _this.setState ({
          securitySettings : resp,
          level: level,
          levelLabel: levelLabel
        },()=> console.log('security settings',_this.state.securitySettings))
        
      }
         
    })
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

  handleSubmit = () => {

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    this.onSubmitPress()


  }

  

  validateNewPassword = (pwd) => {


    // this is the score we need to match with this.state.securitySettings.Pswd_Complexity
    let score = zxcvbn(pwd).score

    console.log("password: ", pwd)
    console.log("score: ", score)
    console.log("Pswd_Complexity", this.state.securitySettings.Pswd_Complexity)

    let level = strengthLevels.find(function(item){
        return item.score === score
    })

    console.log("level", level)

    let isAcceptable = false
    if(score >= this.state.securitySettings.Pswd_Complexity) {

      isAcceptable = true

      // just swap red and green to match the site colors
      level.borderColor = brand.colors.success
      level.backgroundColor = brand.colors.success
      //level.label = "Acceptable"


    }
    else {

      // just swap red and green to match the site colors
      level.borderColor = brand.colors.danger
      level.backgroundColor = brand.colors.danger
      //level.label = "Weak"

    }


    console.log("isAcceptable", isAcceptable)

    //console.log('level: ', level.label)

    this.setState({
      newPassword: pwd,
      newPasswordLevel: level,
      newPasswordConfirmed: "",
      newPasswordScore: score,
      isAcceptable: isAcceptable
    })



  }


  onSubmitPress = () => {

    Keyboard.dismiss()
    
    let _this = this
    
    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    // console.log("comparing current:", this.props.screenProps.state.userData.password, " to entered:", this.state.confirmCurrentPassword)
    
    // if(this.props.screenProps.state.userData.password !== this.state.confirmCurrentPassword) {

    //   this.setState({
    //     sending: false,
    //     requestStatus: {
    //         hasError: true,
    //         message: "Your current password was entered incorrectly."
    //     },
    //   })

    //   return
    // }

    console.log("comparing new:", this.state.newPassword, " to confirmed:", this.state.newPasswordConfirmed)

    if(this.state.newPassword !== this.state.newPasswordConfirmed) {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "Your passwords don't match."
        },
      })

      return
    }

    console.log("checking complexity:", this.state.newPasswordLevel.level)

    // if at least "Good"
    //if(this.state.newPasswordLevel.level >= 3) {
    if(this.state.newPasswordScore >= this.state.securitySettings.Pswd_Complexity) {

        let request = {
            userId: this.props.screenProps.state.userData.userId, 
            email: this.props.screenProps.state.userData.email,
            password: this.state.newPassword,
            clientCode : this.props.screenProps.state.selectedClient
        }

        console.log("change password request", JSON.stringify(request, null, 2))

        changePassword(request, this.props.screenProps.state.userData.token, function (err, response){

          if (err){
            console.log("changePassword error", err)

            _this.setState({
              sending: false,
              requestStatus: {
                  hasError: true,
                  message: err.message
              },
            })

          }

          else {

            
            console.log("changePassword success", response)

            if(response.message && response.message.indexOf("Please enter a different password") !== -1) {

                _this.setState({
                  sending: false,
                  requestStatus: {
                      hasError: true,
                      message: response.message
                  },
                })

                return

            }


            //*****************************************************************
            // Consider it a success...
            //*****************************************************************

            if(response.success) {

              _this.setState({
                sending: true,
                requestStatus: {
                    hasError: true,
                    message: "Your password was changed successfully."
                },
              })



              userData = _this.props.screenProps.state.userData

              userData.password = _this.state.newPassword
              // update this to false so that we don't keep asking them to change it,
              // or have to wait for another login to potentially update it
              userData.mustChangePassword = false 

              _this.props.screenProps._globalStateChange( { action: "change-password", userData: userData })


              // redirect to the DrawerStack
              const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
              });

              setTimeout(() => {_this.props.navigation.dispatch(resetAction)}, 3000)

            }
          
 
          } // end else


        }) // end changePassword


    }
    else {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "Your new password doesn't meet the complexity requirements."
        },
      })

    }






  }
  




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


        
    ) // end return

   
  } // end render

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


//make this component available to the app
export default Password;