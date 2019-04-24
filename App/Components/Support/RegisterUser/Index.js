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

// import Styles from './Styles'

import ImagePicker from 'react-native-image-picker'
import { reportIssue } from '../../../Services/Support'

import DeviceInfo from 'react-native-device-info'

var options = {
  
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

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
      email: this.props.screenProps.state.userData.email
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

    Keyboard.dismiss()

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    if(this.state.email === '') {

      this.setState({
        sending: false,
        requestStatus: {
            hasError: true,
            message: "Please enter your email address."
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
      rosnet_user_id : userData.userId,
      email : userData.email,
      name: userData.commonName,
      location : this.state.location
      
    }

    console.log("submitting request", JSON.stringify(request, null, 2))


    // reportIssue (this.props.screenProps.state.selectedClient, userData.token, request, function(err, resp){
    //   if(err){
    //     console.log('errror reporting Issue',err)

    //     _this.setState({
    //       sending: false,
    //       requestStatus: {
    //           hasError: true,
    //           message: err.message
    //       },
    //       wasAlreadySent: true
    //     })


    //   }
    //   else {
    //     console.log('issue reported successfully')

    //     _this.setState({
    //       sending: false,
    //       requestStatus: {
    //           hasError: false,
    //           message: "Your support request was sent successfully."
    //       },
    //       wasAlreadySent: true
    //     })

    //   }
    // })

  }


  render() {

    return (

      <KeyboardAvoidingView behavior="padding" style={styles.container}>


        <View style={styles.formContainer}>

            <Text style={styles.inputLabel} >
              Sorry, you currently don't have an email address registered with our support system. 
              Please enter your email address below.
            </Text>

            <Text style={styles.inputLabel} >
              Email Address
            </Text>


            <TextInput style={styles.input}   
                    //ref={input => { this.textInput = input }}
                    //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                    placeholder='Email address' 
                    placeholderTextColor={brand.colors.silver}
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email: email})}
            />


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