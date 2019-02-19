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
  Platform
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'
import _ from 'lodash'
import zxcvbn from 'zxcvbn'
import brand from '../../../Styles/brand'
import PasswordStrengthCheck from './PasswordStrengthCheck'
import { changePassword } from '../../../Services/Account';

const regex = {
  digitsPattern: /\d/,
  lettersPattern: /[a-zA-Z]/,
  lowerCasePattern: /[a-z]/,
  upperCasePattern: /[A-Z]/,
  wordsPattern: /\w/,
  symbolsPattern: /\W/
};



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
      },
      changePasswordAct : false,
      resonseMessage : '',
      sending : 'false',
      currentPassword : this.props.screenProps.state.userData.password,
      validating:false,
      unValidated:false,
      validated:false,
      passwordConfirmed : 'false',
      error : 'false',
      confirmError:'false',
      currentPassError:'false',
      levelError : 'false'
    };
  }

  
  
  _onChangePassword = (password, isValid) => {
    this.setState({ password: { value: password, isValid: isValid } })
  }

  validateCurrentPass = (text) => {

    _this = this
    console.log('<<CurrentPass',this.state.currentPassword)
    console.log('<<Text',text)

    _this.setState({
      validating:true,
      unValidated :false,
      validated:false,
      currentPassError : 'false'
    })

    if (_this.state.currentPassword === text){
      _this.setState({
        validated :true,
        validating :false,
        unValidated:false,
        error :false,
        //currentError :false
      })
    }
    
    else if(_this.state.changePassword !== text){
      _this.setState({
        validated:false,
        validating:false,
        unValidated:true,
        error:true,
        //currentError :true
      })
    }
  }

  confirmPassword = (text) => {

    _this = this
    

    _this.setState({
      passwordConfirmed : 'false',
      confirmPressed : true,
      confirmError : 'false'
    })

    if (_this.state.password.value === text) {
      _this.setState({passwordConfirmed : 'true'})
    }
    else if(_this.state.changePassword !== text){
      _this.setState({
        passwordConfirmed : 'false'
      })
    }

  }

  isTooShort(password) {
    //const { minLength } = this.props;
    const minLength = 4
    if (!minLength) {
      return true;
    }
    return password.length < minLength;
  }
  
  isMatchingRules(password) {
    //const { ruleNames } = this.props;
    const ruleNames = 'symbols|words'
    if (!ruleNames) {
      return true;
    }
    
    const rules = _.chain(ruleNames)
      .split('|')
      .filter(rule => !!rule)
      .map(rule => rule.trim())
      .value();
    
    for (const rule of rules) {
      if (!this.isMatchingRule(password, rule)) {
        return false;
      }
    }
    return true;
  }
  
  isMatchingRule(password, rule) {
    switch (rule) {
      case 'symbols':
        return regex.symbolsPattern.test(password);
      case 'words':
        return regex.wordsPattern.test(password);
      case 'digits':
        return regex.digitsPattern.test(password);
      case 'letters':
        return regex.lettersPattern.test(password);
      case 'lowerCase':
        return regex.lowerCasePattern.test(password);
      case 'upperCase':
        return regex.upperCasePattern.test(password);
      default:
        return true;
    }
  }
  
  calculateScore(text) {
    if (!text) {
      this.setState({
        isTooShort: false
      });
      return -1;
    }
    
    if (this.isTooShort(text)) {
      this.setState({
        isTooShort: true
      });
      return 0;
    }
    
    this.setState({
      isTooShort: false
    });
    
    if (!this.isMatchingRules(text)) {
      return 0;
    }
    
    return zxcvbn(text).score;
  }
  
  getPasswordStrengthLevel(password) {
    return this.calculateScore(password);
  }

  newPassword = (text,isValid) => {



    _this = this

    _this.setState ({
      password: { value: text, isValid: isValid }
    })
  }


  onSubmitPress = (token,strengthLevels) => {

    console.log('passval',this.state.password.value)
    console.log('strengthLevels',strengthLevels)
    let _this = this

    const level = _this.getPasswordStrengthLevel(this.state.password.value)
    console.log ('<<level',level)

    // _this.setState ({
    //   error :false
    // })
    
    let request = {
        userId: this.props.screenProps.state.userData.userId, 
        password: this.state.password.value, 
        //password:'Rowdy fellow'
    }

    var Confirm = this.state.passwordConfirmed
    _this.setState({
      error : false,
      sending : 'true',
    },()=> {
      console.log('sendingSetT',_this.state.sending)
    })

    console.log('<<confirm pass',Confirm,this.state.error,level)

     
     if ( Confirm === 'true' && this.state.error === 'false' && level >= 2) {

      changePassword(request, token, function (err,response){

        if (err){
          Keyboard.dismiss()
          console.log("userLogin error", err)
        }

        else {
          
          console.log("changePassword success:", response)

          console.log('success')
          if(response){
            //alert('got response')
            _this.setState({
              resonseMessage: response.message,
              changePasswordAct : true,
              error:false,
              confirmError :'false',
              currentPassError:false,
              confirmPassword:false,
              sending : 'false'
            } , ()=> {
              console.log('sendingSetF',_this.state.sending)
            })
          }
        }
    })

    } 
    else if (level < 2) {
      _this.setState ({
        error : 'false',
        levelError : 'true',
        //error : 'true',
        confirmError : 'false',
        currentPassError : 'false',
        sending:'false'
      })
    }
    else {
      _this.setState({
        error : 'true',
        confirmError : 'true',
        currentPassError : 'true',
        sending:'false'
      })
    } 


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
                <View style={{flexDirection :'row'}}>
                <TextInput style={styles.input}   
                         returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                         placeholder='Current Password' 
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText={(text) => this.validateCurrentPass(text)}
                 />
              {this.state.validating &&  <ActivityIndicator size="small" color={brand.colors.primary} style ={{margin:10,position:'absolute',marginLeft:'55%'}} />}
              {this.state.validated && <Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.success}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.unValidated && <Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.lightGray}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.currentPassError === 'true'  && <Ionicon name = 'md-close-circle' 
                                size={30}
                                color={brand.colors.danger}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}

                </View>
                
                 
            <Text style={{margin:10}}>New Password</Text>

            <View>
            <PasswordStrengthCheck
                    secureTextEntry
                    //editable = {this.state.validated}
                    minLength={4}
                    ruleNames="symbols|words"
                    strengthLevels={strengthLevels}
                    tooShort={tooShort}
                    minLevel={0}
                    barWidthPercent={65}
                    showBarOnEmpty={true}
                    barColor="#CCC"
                    placeholder ={'Text me'}
                    //inputWrapperStyle = {styles.input}
                    //onChangeText = {(text,isValid) => this.newPassword(text,isValid)}
                    onChangeText={(text, isValid) => this.setState({ password: { value: text, isValid: isValid },levelError : 'false' })} 
                    />
            </View>
                
                 


            <Text style={{margin:10}}>Confirm Password</Text>
                 
                 <View style={{flexDirection:'row'}}>
                 <TextInput style={styles.input}   
                         returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                         placeholder='Confirm Password' 
                         //editable = {this.state.validated}
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText= {(text) => this.confirmPassword(text)}
                 />
                 {this.state.passwordConfirmed === 'true' &&<Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.success}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.passwordConfirmed === 'false' && this.state.confirmPressed && <Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.lightGray}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.confirmError === 'true' && this.state.confirmPressed && <Ionicon name = 'md-close-circle' 
                                size={30}
                                color={brand.colors.danger}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                 </View>
                
                
                
           {<TouchableHighlight style={styles.buttonContainer } >
                <Text  style={styles.buttonText} onPress = { ()=> this.onSubmitPress(this.props.screenProps.state.userData.token,strengthLevels) }>Submit</Text>
    </TouchableHighlight> }

            {this.state.sending === 'true' ? <ActivityIndicator size="large" color={brand.colors.primary} style ={{margin:10}} />: null}
            {this.state.changePasswordAct && this.state.resonseMessage ? <View style={{ 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginBottom: 15,
                                marginTop: 10,
                                margin:5,
                                flexDirection:'column',
                                borderColor: brand.colors.danger,
                                borderWidth:2,
                                borderBottomWidth:2
                            }}> 
                                <Ionicon name = 'md-alert' 
                                size={35}
                                color={brand.colors.danger}
                                style={{ paddingLeft: 10 }}/>
                                <Text style={{color: brand.colors.primary,padding:5 }}>{this.state.resonseMessage}</Text>
                            </View> : null}


                            {this.state.error === 'true' && <Text style={{color:brand.colors.danger,marginTop:20,margin:10}}>Errors exist in the fields entered. Try Again till you get two green checkmarks</Text>}
                            { this.state.levelError === 'true' && <Text style={{color:brand.colors.danger,marginTop:20,margin:10}}>Password too weak. Try using special characters and alphanumerics</Text>}


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
      width:'64%',
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