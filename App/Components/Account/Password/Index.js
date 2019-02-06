import React from 'react';
import { 
  View, 
  Image,
  Text, 
  TextInput, 
  TouchableOpacity, 
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
  Platform
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'
//import PasswordStrengthChecker from 'react-native-password-strength-checker';
import PasswordStrengthCheck from './PasswordStrengthCheck'




class Password extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Change Password',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

  constructor(props) {
    super(props);
    
    this.state = {
      fullName: {
        value: ''
      },
      userName: {
        value: ''
      },
      password: {
        value: '',
        isValid: false
      }
    };
  }
  
  _onChangePassword(password, isValid) {
    this.setState({ password: { value: password, isValid: isValid } })
  }
  


  render() {

    const strengthLevels = [
      {
        label: 'Weak',
        labelColor: brand.colors.gray,
        widthPercent: 25,
        innerBarColor: '#fe6c6c'
      },
      {
        label: 'Weak',
        labelColor: brand.colors.gray,
        widthPercent: 25,
        innerBarColor: '#fe6c6c'
      },
      {
        label: 'Fair',
        labelColor: brand.colors.info,
        widthPercent: 50,
        innerBarColor: '#feb466'
      },
      {
        label: 'Good',
        labelColor: brand.colors.secondary,
        widthPercent: 75,
        innerBarColor: '#81fe2c'
      },
      {
        label: 'Strong',
        labelColor: brand.colors.success,
        widthPercent: 100,
        innerBarColor: '#6cfeb5'
      }
    ];
    
    // Enable too short
    const tooShort = {
      enabled: true,
      label: 'Too short',
      labelColor: 'red'
    };
    

    return (
      
        <ScrollView>

<View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

<Text style={{margin:10,marginTop:30}}>Current Password</Text> 
<TextInput style={styles.input}   
                         returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                         placeholder='Current Password' 
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText={(text) => this.setState({password: text})}
                 />
                 <Text style={{margin:10}}>New Password</Text>
                 {/* <TextInput style={styles.input}   
                         returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                         placeholder='New Password' 
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText={text => this.setState({ password: { value: text } })}
                 /> */}
                 <PasswordStrengthCheck 
            secureTextEntry
            minLength={4}
            ruleNames="symbols|words"
            strengthLevels={strengthLevels}
            tooShort={tooShort}
            minLevel={0}
            barWidthPercent={65}
            showBarOnEmpty={false}
            barColor="#CCC"
            inputStyle = {styles.passwordInput}
            onChangeText={(text, isValid) => this.setState({ password: { value: text, isValid: isValid } })} 
            />


                 <Text style={{margin:10}}>Confirm Password</Text>
                 <TextInput style={styles.input}   
                         returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                         placeholder='Confirm Password' 
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText={text => this.setState({ password: { value: text } })}
                 />

<TouchableOpacity 
                     style={styles.buttonContainer }
                     >
                     <Text  style={styles.buttonText}>Submit</Text>
                 </TouchableOpacity> 


            </View>



        </ScrollView>           
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   padding: 20
  },
  input:{
      height: 40,
      backgroundColor: '#ffffff',
      marginBottom: 10,
      width:'60%',
      padding: 10,
      color: brand.colors.primary,
      borderColor: brand.colors.primary, 
      borderWidth: 1,
      borderRadius: 10
  },
  passwordInput :{
      height: 40,
    backgroundColor: '#fff',
    marginBottom: 10,
    width:'100%',
    padding: 10,
    marginRight:'40%',
    marginLeft:'15%',
    color: brand.colors.primary,
    borderColor: brand.colors.primary, 
    borderWidth: 1,
    borderRadius: 10},
  buttonContainer:{
      marginTop: 20,
      backgroundColor: brand.colors.primary,
      paddingVertical: 10,
      borderRadius: 10,
      width:100,
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
export default Password;