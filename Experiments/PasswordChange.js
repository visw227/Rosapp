import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  AsyncStorage,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../App/Styles/brand'

//import Styles from './Styles'

import { List, ListItem, Avatar } from 'react-native-elements'


import zxcvbn from 'zxcvbn';


// hide warnings for now...
console.disableYellowBox = true;


const strengthLevels = [
  {
    label: 'Strength',
    labelColor: brand.colors.gray,
    min: 0,
    max: 0,
    backgroundColor: brand.colors.lightGray,
    borderColor: brand.colors.gray
  },
  {
    label: 'Dangerous',
    labelColor: brand.colors.white,
    min: 0,
    max: 25,
    backgroundColor: brand.colors.danger,
    borderColor: brand.colors.danger
  },
  {
    label: 'Weak',
    labelColor: brand.colors.white,
    min: 26,
    max: 49,
    backgroundColor: brand.colors.danger,
    borderColor: brand.colors.danger
  },
  {
    label: 'Good',
    labelColor: brand.colors.white,
    min: 50,
    max: 74,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  },
  {
    label: 'Strong',
    labelColor: brand.colors.white,
    min: 75,
    max: 89,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  },
  {
    label: 'Very Strong',
    labelColor: brand.colors.white,
    min: 90,
    max: 100,
    backgroundColor: brand.colors.success,
    borderColor: brand.colors.success
  }
];


class Profile extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Profile',

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
          Save
          </Text>
      </View>,


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
        newPassword: '',
        newPasswordStrength: 0,
        newPasswordLevel: strengthLevels[0]
    }

  }




  validateCurrentPassword = (pwd) => {

  }

  validateNewPassword = (pwd) => {



    console.log('*** PASSWORD: ' + pwd)
    
    var analysis = zxcvbn(pwd);

    var strengthPercentage = Math.floor(Number((analysis.guesses_log10 / 12.0).toFixed(2).replace(/0+$/, '')) * 100.0);
    if (strengthPercentage > 100) {
      strengthPercentage = 100;
    };

    console.log('*** STRENGTH PERCENTAGE: ' + strengthPercentage.toString())


    let level = strengthLevels.find(function(item){
        return strengthPercentage >= item.min && strengthPercentage <= item.max
    })

    console.log('level: ', level)

    this.setState({
      newPassword: pwd,
      newPasswordStrength: strengthPercentage,
      newPasswordLevel: level
    })



  }



  render() {


    return (


            <KeyboardAvoidingView behavior="padding" style={styles.container}>


                <View style={styles.formContainer}>
       

                    <Text style={styles.inputLabel}>Current Password</Text>


                    <TextInput style={styles.input}     
                            ref={input => { this.textInput = input }}
                            //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                            placeholder='Current Password' 
                            placeholderTextColor={brand.colors.silver}
                            autoCorrect={false}
                            autoCapitalize="none"
                            onChangeText={(text) => this.validateCurrentPassword(text)}
                            secureTextEntry={true}
                            // these settings will allow the text to be seen until the input looses focus
                            //secureTextEntry = { this.state.isCurrentPasswordSecureTextEntry }
                            //onFocus={() => this.setState({ isCurrentPasswordSecureTextEntry: false })}
                            //onBlur={() => this.setState({ isCurrentPasswordSecureTextEntry: true })}
                    />



                    <Text style={styles.inputLabel} >New Password</Text>


                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        alignContent: 'flex-start',
                      }}
                      >

                      <TextInput style={[styles.inputNewPassword, { borderColor: this.state.newPasswordLevel.borderColor }]} 
                          autoCapitalize="none" 
                          //onSubmitEditing={() => this.passwordInput.focus()} 
                          autoCorrect={false} 
                          keyboardType='default' 
                          returnKeyType="go" 
                          placeholder='New Password'
                          placeholderTextColor={brand.colors.silver}
                          value={this.state.newPassword}
                          onChangeText={(text) => this.validateNewPassword(text)}
                      />

                      <View style={[styles.strengthDisplay, { borderColor: this.state.newPasswordLevel.borderColor, backgroundColor: this.state.newPasswordLevel.backgroundColor } ]}>
                        <Text style={[
                          { 
                            color: this.state.newPasswordLevel.labelColor, 
                            textAlign: 'center'
                          } ]}>{this.state.newPasswordLevel.label}</Text>
                      </View>

                    </View>




                    <Text style={styles.inputLabel}>Confirm Password</Text>


                    <TextInput style={styles.input}   
                            returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                            placeholder='Confirm Password' 
                            ref={input => { this.confirmPassInput = input }}
                            placeholderTextColor={brand.colors.silver}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText= {(text) => this.confirmPassword(text)}
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

    );
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.white,
        paddingTop: 100
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
    inputLabel: {
      color: brand.colors.primary,
      marginLeft: 5
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 30, 
      paddingRight: 30,
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
export default Profile;