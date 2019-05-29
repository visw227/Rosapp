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


import brand from '../../../Styles/brand'


import { Zendesk } from '../../../Helpers/Zendesk'

import DeviceInfo from 'react-native-device-info'

var options = {
  
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class SupportRequest extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Report an Issue',

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


       
    let deviceId = DeviceInfo.getUniqueID()
    let appVersion = DeviceInfo.getVersion()
    let appBuild = DeviceInfo.getBuildNumber()
    let osVersion = DeviceInfo.getSystemVersion()
    let deviceBrand = DeviceInfo.getBrand()
    let deviceModel = DeviceInfo.getModel()
 
    let ts =  moment().format('dddd, MMM Do') + ' @  ' +  moment().format('h:mm:ss A')

    this.state = {
      sending: false,
      receiving: false,
      requestStatus: {
          hasError: false,
          message: ""
      },
      wasAlreadySent: false,
      subject: '', //Test by ' + this.props.screenProps.state.userData.userName,
      location: '', //ts,
      description: '', //Delete this but please email me at ' + this.props.screenProps.state.userData.email + ' so that I know that this was received by ZenDesk',
      deviceId: deviceId,
      version: appVersion,
      appBuild: appBuild,
      appCenterInstallId: '',
      deviceBrand : deviceBrand,
      osVersion,
      deviceModel: deviceModel,
      options,
      deviceInfo : 'appVersion: ' + appVersion + ', appBuild: ' + appBuild + ', deviceId: '+ deviceId +  ', deviceBrand: '+ deviceBrand + ', deviceModel: ' + deviceModel + ', osVersion: ' + osVersion
    }
  }

  componentDidMount() {

    let _this = this

    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit,
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    AsyncStorage.getItem('AppCenterInstallId').then((data) => {
        _this.setState({
            appCenterInstallId: data
        })
    })

    console.log('<<<deviceInfo',this.state.deviceInfo)

  }


  handleSubmit = () => {

    Keyboard.dismiss()

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    if(this.state.subject === '' || this.state.location === '' || this.state.description === '') {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "Please include a subject, a location where the issue occurred, and a description."
        },
      })

    }
    else if(this.state.wasAlreadySent) {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "This support request has already been sent."
        },
      })

    }
    else {
      this.onSubmitPress()
    }



  }


  onSubmitPress = () => {


    let _this = this
    
    var userData = this.props.screenProps.state.userData

    let request = {
      subject : this.state.subject,
      description : this.state.description,
      location : this.state.location,
      browser : this.state.deviceInfo,
      value : null, // no images provided by app
      
    }

    console.log("submitting request", JSON.stringify(request, null, 2))


    Zendesk.ReportIssue (this.props.screenProps.state.selectedClient, userData.token, request, function(err, resp){
      if(err){
        console.log('errror reporting Issue',err)

        _this.setState({
          sending: false,
          requestStatus: {
              hasError: true,
              message: err.message
          },
          wasAlreadySent: true
        })


      }
      else {

        // if successfull, take the user back to the list of tickets
        if(resp.result && resp.result.ok && resp.result.ok === true) {

          console.log('issue reported successfully')

          _this.props.navigation.navigate('SupportList') 

        }
        else {

          _this.setState({
            sending: false,
            requestStatus: {
                hasError: true,
                message: "Sorry, but an error occurred while submitting your support request. "
            },
            wasAlreadySent: true
          })

        }




      }
    })

  }


  render() {

    return (

      <KeyboardAvoidingView behavior="padding" style={styles.container}>


        <View style={styles.formContainer}>


            <Text style={styles.inputLabel}>Subject</Text>



            <TextInput style={styles.input}   
                    //ref={input => { this.textInput = input }}
                    //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                    placeholder='What is the issue' 
                    placeholderTextColor={brand.colors.silver}
                    value={this.state.subject}
                    onChangeText={(subject) => this.setState({subject})}
            />

            <Text style={styles.inputLabel}>Location</Text>
                 
            <TextInput style={styles.input}   
                    returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                    placeholder='Screen where issue exists' 
                    //ref={input => { this.confirmPassInput = input }}
                    //editable = {this.state.validated}
                    placeholderTextColor={brand.colors.silver}
                    value={this.state.location}
                    onChangeText= {(location) => this.setState({location})}
            />
   

            <Text style={styles.inputLabel}>Description</Text>
                 
            <TextInput  style={[styles.input, styles.textArea]}
              multiline 
              //returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
              placeholder='Explain in brief what the issue is' 
              ref={input => { this.confirmPassInput = input }}
              placeholderTextColor={brand.colors.silver}
              value={this.state.description}
              onChangeText= {(description) => this.setState({description})}
            />
                

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
export default SupportRequest;