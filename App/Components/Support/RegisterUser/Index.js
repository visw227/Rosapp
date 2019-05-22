import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  TouchableHighlight,
  ScrollView,
  TextInput,
  AsyncStorage,
  KeyboardAvoidingView,
  ActivityIndicator,
  Keyboard
} from 'react-native';

import moment from 'moment'

import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'


import { Zendesk } from '../../../Helpers/Zendesk'


import { updateProfile } from '../../../Services/User';


class RegisterUser extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Register Email',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
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
          Submit
          </Text>
      </View>


  })

  constructor(props) {
    super(props)



    this.state = {
      sending: false,
      receiving: false,
      requestStatus: {
          hasError: false,
          message: ""
      },
      zenEmail: null,
      zenName: null,
      askUserForEmailAddress: false,
      wasAlreadySent: false,
    }
  }

  componentDidMount() {

    let _this = this

    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit,
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })


  }


  handleSubmit = () => {

    console.log("submitting", this.state.zenEmail, this.state.zenName)

    Keyboard.dismiss()

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    if(this.state.zenEmail === '') {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "Please enter your email address."
        },
      })

    }
    else if(this.state.wasAlreadySent) {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "This email address has already been registered."
        },
      })

    }
    else {
      this.onSubmitPress()
    }



  }


  onSubmitPress = () => {

    let _this = this

    Keyboard.dismiss()
    
    let userData = this.props.screenProps.state.userData
    let client = this.props.screenProps.state.selectedClient

    // if we asked the user to enter an email address, save it in ros_master.rosnet_email
    if(this.state.askUserForEmailAddress) {

      if(this.state.zenEmail === '') {

        this.setState({
          requestStatus: {
            hasError: true,
            message: "Please enter your email address"
          }
        })

        return
      
      }

      let profileRequest = {
        //jobTitle: this.state.jobTitle,
        email: this.state.zenEmail
      }

      // commenting this out for now since there is a nightly bactch process that creates Zendesk users
      // updateProfile(this.props.screenProps.state.selectedClient, this.props.screenProps.state.userData.token, profileRequest, function(err, resp){
      //   if(err){
      //     console.log('errror updating profile',err)
      //   }
      //   else {
      //     // save the users email to the global state
      //     userData.email = _this.state.zenEmail
      //     _this.props.screenProps._globalStateChange( { action: "profile-update", userData: userData })
      //   }
      // })

    }

    // this is a "faked" session object just to reuse Zendesk.RegisterUser
    let session = {
      RosNetUserId: userData.userId,
      ZendeskEmail: this.state.zenEmail,
      ZendeskFullName: userData.commonName
    }

    Zendesk.RegisterUser(userData, client, userData.token, session, function(err, resp){

      if(err){
        console.log('errror creating Zendesk user',err)


        let message = "Sorry, we weren't able to register your email address. The exact error was: " + err.message.substring(0, 500)

        if(err.alreayExists) {
            message = "This email address has already been registered."
        }

        _this.setState({
          sending: false,
          requestStatus: {
              hasError: true,
              message: message
          },
          wasAlreadySent: false // keep false in case change email
        })


      }
      else {
        console.log('user added successfully')

        _this.setState({
          sending: true, // keep the spinner showing since we will redirect back to the SupportList screen after a brief delay to confirm to the user something happened
          requestStatus: {
              hasError: false,
              message: "Your email address was registered successfully."
          },
          wasAlreadySent: true
        })

        // wait a second and take the user back to the support list screen
        setTimeout(() => {
          _this.props.navigation.navigate('SupportList')
        }, 1000); // 1.5 seconds

       

      }
    })

  }


  render() {

    return (

      <KeyboardAvoidingView behavior="padding" style={styles.container}>


        <View style={styles.formContainer}>


            <View>

              <Text style={styles.inputLabel} >
                For support requests, please provide your email address.
              </Text>

              <Text style={styles.inputLabel} >
                Email Address
              </Text>

              <TextInput style={styles.input}   
                      //ref={input => { this.textInput = input }}
                      //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                      placeholder='Email address' 
                      placeholderTextColor={brand.colors.silver}
                      value={this.state.zenEmail}
                      onChangeText={(zenEmail) => this.setState({ zenEmail: zenEmail.toLowerCase() })}
              />

            </View>
     

            {this.state.sending &&
            <View style={{ marginTop: 20, marginBottom: 10 }} >
                <ActivityIndicator size="large" color={brand.colors.primary} />
            </View>
            }

            <Text style={styles.message} >
              {this.state.requestStatus.message}
            </Text>


        </View>


      </KeyboardAvoidingView>

    )}
  
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.white,

    },
    formContainer: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
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
    textArea: {
      height: 100
    },
    inputLabel: {
      color: brand.colors.primary,
      marginTop: 15, 
      marginLeft: 5
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 30, 
      paddingRight: 30,
      color: brand.colors.primary
    }
   
});


//make this component available to the app
export default RegisterUser;