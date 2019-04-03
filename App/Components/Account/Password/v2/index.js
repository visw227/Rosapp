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
import { NavigationActions, StackActions } from 'react-navigation'
//import Entypo from 'react-native-vector-icons/Entypo'

import _ from 'lodash'
import zxcvbn from 'zxcvbn'
import brand from '../../../Styles/brand'
import PasswordStrengthCheck from './PasswordStrengthCheck'
import { changePassword,userLogin } from '../../../Services/Account';
import { getSiteSecuritySettings} from '../../../Services/Security';
import AlerMessage from '../../Modules/AlertMessage'


const regex = {
  digitsPattern: /\d/,
  lettersPattern: /[a-zA-Z]/,
  lowerCasePattern: /[a-z]/,
  upperCasePattern: /[A-Z]/,
  wordsPattern: /\w/,
  symbolsPattern: /\W/
};


const strengthLevels = [
  {
    label: 'Weak',
    labelColor: brand.colors.gray,
    widthPercent: 25,
    innerBarColor: brand.colors.gray
  },
  {
    label: 'Fair',
    labelColor: brand.colors.orange,
    widthPercent: 50,
    innerBarColor: brand.colors.orange
  },
  {
    label: 'Good',
    labelColor: brand.colors.secondary,
    widthPercent: 75,
    innerBarColor: brand.colors.seondary
  },
  {
    label: 'Strong',
    labelColor: brand.colors.success,
    widthPercent: 100,
    innerBarColor: brand.colors.success
  }
];

// Enable too short
const tooShort = {
  enabled: false,
  label: 'Too short',
  labelColor: brand.colors.orange
};



class Password extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Change Password',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
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
      fullName: {
        value: ''
      },
      userName: this.props.screenProps.state.userData.userName,
      password: {
        value: '',
        isValid: false
      },
      changePasswordAct : false,
      resonseMessage : '',
      sending : false,
      currentPassword : this.props.screenProps.state.userData.password,
      validating:false,
      unValidated:false,
      validated:false,
      passwordConfirmed : false,
      error : false,
      confirmError:false,
      currentPassError:false,
      levelError : false,
      changeSuccess : false,
      fadeAnim: new Animated.Value(0),
      secSetting : {},
      isCurrentPasswordSecureTextEntry: false
    };
  }
  

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


  componentDidMount () {

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit,
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })


    _this = this

    var request = this.props.screenProps.state.userData.selectedSite

    getSiteSecuritySettings (request, function(err,resp) {
      if (err){
        console.log ('Error siteSettings',err)
      }
      else {

        _this.setState ({
          secSetting : resp
        },()=> console.log('<<resp',_this.state.secSetting))
        
      }
        
    })
  
  }
  
   

  validateCurrentPass = (text) => {

    _this = this
    console.log('<<CurrentPass',this.state.currentPassword)
    _this.setState({
      validating:true,
      unValidated :false,
      validated:false,
      currentPassError : false
    })

    if (_this.state.currentPassword === text){
      _this.setState({
        validated :true,
        validating :false,
        unValidated:false,
        error :false
      })
      return true
    }
    else if(_this.state.currentPassword !== text){
      _this.setState({
        validated:false,
        validating:false,
        unValidated:true,
        error:true,
        //currentError :true
      })
      return false
    }
  }

  confirmPassword = (text) => {
    
    this.setState({
      passwordConfirmed : false,
      confirmPressed : true,
      confirmError : false
    })

    if (this.state.password.value === text) {
      this.setState({passwordConfirmed : true})
      
    }
    else if(this.state.changePassword !== text){
      this.setState({
        passwordConfirmed : false
      })
    }

  }

  isTooShort(password) {
    //const { minLength } = this.props;
    const minLength = this.state.secSetting.Min_Pswd_Length
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



  onSubmitPress = () => {

    

    console.log('passval',this.state.password.value)
    
    let _this = this

    const level = _this.getPasswordStrengthLevel(this.state.password.value)
    
    let request = {
        userId: this.props.screenProps.state.userData.userId, 
        email: this.props.screenProps.state.userData.email,
        password: this.state.password.value,
        clientCode : this.props.screenProps.state.userData.selectedSite
    }


    console.log("Confirm", this.state.passwordConfirmed)
    _this.setState({
      error : false,
      sending : true,
    },()=> {
      console.log('sendingSetT', _this.state.sending, this.state.error)
    })
     
     if (this.state.passwordConfirmed && this.state.validated && level >= this.state.secSetting.Pswd_Complexity) {

        changePassword(request, this.props.screenProps.state.userData.token, function (err,response){

          if (err){
            Keyboard.dismiss()
            console.log("userLogin error", err)
          }

          else {

            if(response){
              _this.setState({
                resonseMessage: response.message,
                changePasswordAct : true,
                error:false,
                confirmError :false,
                currentPassError:false,
                confirmPassword:false,
                sending : false
              } , ()=> {
                console.log('sendingSetF',_this.state.sending)
              })
            }
            
              if (_this.state.changePasswordAct && _this.state.resonseMessage !== '') {

              userData = _this.props.screenProps.state.userData

              userData.password = _this.state.password.value

              AsyncStorage.setItem('userData', JSON.stringify(userData))

              // keep this around for later uses like auto-re-login to make sure user is still active and/or has same client locations
              AsyncStorage.setItem('loginData', JSON.stringify( { userName: userData.userName, password: userData.password }))


              _this.props.screenProps._globalStateChange( { action: "change-password", userData: userData })

              _this.setState({
                currentPassword : _this.state.password.value,
                changeSuccess : true
              })

              Animated.timing(                  // Animate over time
                _this.state.fadeAnim,            // The animated value to drive
                {
                  toValue: 1,                   // Animate to opacity: 1 (opaque)
                  duration: 1000,              // Make it take a while
                }
              ).start();  

              let stackName = 'DrawerStack'

              const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: stackName })],
            });

            setTimeout(() => {_this.props.navigation.dispatch(resetAction)},4000)
            
            }

            console.log("changePassword success:", response)

            console.log('success')
            
          }

        }) // end changePassword

    } 
    //else conditions not executing as expected.. Adding else if for prompt execution
    else if (level < this.state.secSetting.Pswd_Complexity) {
      _this.setState ({
        error : false,
        levelError : true,
        //error : true,
        confirmError : false,
        currentPassError : false,
        sending:false
      })
    }
    else if (!this.state.validated && this.state.passwordConfirmed === false){
      _this.setState ({
        confirmError : true,
        currentPassError : true,
        sending : false
      })
    }
    else if (!this.state.validated) {
      _this.setState({
        currentPassError : true ,
        sending:false
      }, ()=> console.log('<<currentPass',this.state.currentPassError))
    } 

    else if (this.state.passwordConfirmed === false) {

      _this.setState({
        //error : true,
        confirmError : true,
        //currentPassError : true ,
        sending:false
      }, ()=> console.log('<<confirmPass',this.state.confirmError))

    }
    else {

      _this.setState({
        //error : true,
        confirmError : true,
        //currentPassError : true ,
        sending: false
      }, ()=> console.log('<<confirmPass',this.state.confirmError))

    }

  }
  

  onBlurShowAsterisks = () => {

    this.setState({
      isCurrentPasswordSecureTextEntry: true
    })
    
  }


  render() {

    // const strengthLevels = [
    //   {
    //     label: 'Weak',
    //     labelColor: brand.colors.gray,
    //     widthPercent: 25,
    //     innerBarColor: '#fe6c6c'
    //   },
    //   {
    //     label: 'Weak',
    //     labelColor: brand.colors.gray,
    //     widthPercent: 25,
    //     innerBarColor: '#fe6c6c'
    //   },
    //   {
    //     label: 'Fair',
    //     labelColor: brand.colors.info,
    //     widthPercent: 50,
    //     innerBarColor: '#feb466'
    //   },
    //   {
    //     label: 'Good',
    //     labelColor: brand.colors.secondary,
    //     widthPercent: 75,
    //     innerBarColor: '#81fe2c'
    //   },
    //   {
    //     label: 'Strong',
    //     labelColor: brand.colors.success,
    //     widthPercent: 100,
    //     innerBarColor: '#6cfeb5'
    //   }
    // ];
    
    // // Enable too short
    // const tooShort = {
    //   enabled: true,
    //   label: 'Too short',
    //   labelColor: 'red'
    // };

    /*


      NOTE: For now, allowing this page to be used EVEN if the API says they cant
      That way, if the user's login says they need to change their password, we don't have to worry about 
      the other API having a conflicting message
      Plus, the user cant access this page anyway when it's hidden in the menu

    */


  return (
      

            <KeyboardAvoidingView behavior="padding" style={styles.container}>


                <View style={styles.formContainer}>


                <View style={{

                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  alignContent: 'flex-start',
                  margin: 0,
                  padding: 0

                }}>

                  <Text style={styles.inputLabel}>Current Password</Text>

                  {this.state.validated &&  
                  <Ionicon name = 'md-checkmark-circle' 
                                size={20}
                                color={brand.colors.success}
                                style={{ marginBottom: -10, paddingBottom: 0, paddingTop: 0, paddingLeft: 10 }}/>
                                     
                  }  


                </View>


                <TextInput style={styles.input}     
                        ref={input => { this.textInput = input }}
                        //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                        placeholder='Current Password' 
                        placeholderTextColor={brand.colors.silver}
                        autoCorrect={false}
                        autoCapitalize="none"
                        onChangeText={(text) => this.validateCurrentPass(text)}
                        secureTextEntry={true}
                        // these settings will allow the text to be seen until the input looses focus
                        //secureTextEntry = { this.state.isCurrentPasswordSecureTextEntry }
                        //onFocus={() => this.setState({ isCurrentPasswordSecureTextEntry: false })}
                        //onBlur={() => this.setState({ isCurrentPasswordSecureTextEntry: true })}
                />

   
                
                 
                <Text style={styles.inputLabel} >New Password</Text>

                <PasswordStrengthCheck
                    //secureTextEntry
                    minLength={this.state.secSetting.Min_Pswd_Length}
                    value = {this.state.tempPass}
                    ref={input => { this.newPassInput = input }}
                    ruleNames="symbols|words"
                    strengthLevels={strengthLevels}
                    tooShort={tooShort} 
                    minLevel={0}
                    barWidthPercent={90}
                    showBarOnEmpty={false}
                    barColor={ brand.colors.lightGray }
                    placeholder={'Text me'}
                    onChangeText={(text, isValid) => this.setState({ password: { value: text, isValid: isValid },levelError : false,tempPass:text })} 
                />
  
                {/* // only show Confirm Password once the new password passes all of the validations... */}
                {/* {this.state.password.isValid && */}
                <View>
                  <View style={{

                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    alignContent: 'flex-start',
                    margin: 0,
                    padding: 0

                  }}>

                    <Text style={styles.inputLabel}>Confirm Password</Text>


                    {this.state.passwordConfirmed &&  
                    <Ionicon name = 'md-checkmark-circle' 
                                  size={20}
                                  color={brand.colors.success}
                                  style={{ marginBottom: -10, paddingBottom: 0, paddingTop: 0, paddingLeft: 10 }}/>
                                      
                    }  

                  </View>

                  <TextInput style={styles.input}   
                          returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                          placeholder='Confirm Password' 
                          ref={input => { this.confirmPassInput = input }}
                          placeholderTextColor={brand.colors.silver}
                          secureTextEntry
                          autoCapitalize="none"
                          onChangeText= {(text) => this.confirmPassword(text)}
                  />
                 </View>
                {/* } */}
                
                
{/*                 
           {<TouchableHighlight style={styles.buttonContainer } >
                <Text  style={styles.buttonText} onPress = { ()=> this.onSubmitPress(this.props.screenProps.state.userData.token,strengthLevels) }>Submit</Text>
            </TouchableHighlight> } */}

            {this.state.sending === true ? <ActivityIndicator size="large" color={brand.colors.primary} style ={{margin:10}} />: null}
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


                            {this.state.currentPassError === true  && <Text style={{color:brand.colors.danger,marginTop:20,margin:10}}>Current Password Error. Try entering again till you get a green checkmark or try forgot password</Text>}
                            {this.state.confirmError === true   && <Text style={{color:brand.colors.danger,marginTop:20,margin:10}}>Passwords do not match. Try entering again till you get a green checkmark</Text>}
                            {this.state.levelError === true && <Text style={{color:brand.colors.danger,marginTop:20,margin:10}}>Password too weak. Try using special characters and alphanumerics</Text>}


 

        {this.state.changeSuccess &&<Animated.View style = {{flexDirection : 'column',justifyContent:'flex-end',alignItems:'center',marginTop:20,opacity:this.state.fadeAnim}}>
         <Ionicon name = 'md-thumbs-up' 
                                size={60}
                                color={brand.colors.success}
                                style={{ marginTop:10,justifyContent:"center",marginBottom:5 }}/>
          <Animated.Text style={{color : brand.colors.success}}> Password changed successfully!</Animated.Text>
        </Animated.View>}

    
    
    </View>

    </KeyboardAvoidingView>

      
    );

   
  }
}

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#fff',
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
//   input:{
//       height: 40,
//       backgroundColor: '#ffffff',
//       marginBottom: 10,
//       width:'64%',
//       padding: 10,
//       color: brand.colors.primary,
//       borderColor: brand.colors.primary, 
//       borderWidth: 1,
//       borderRadius: 10
//   },
//   passwordInput :{
//       height: 40,
//     backgroundColor: '#fff',
//     marginBottom: 10,
//     width:'100%',
//     padding: 10,
//     marginRight:'40%',
//     marginLeft:'15%',
//     color: brand.colors.primary,
//     borderColor: brand.colors.primary, 
//     borderWidth: 1,
//     borderRadius: 10},
//   buttonContainer:{
//       marginTop: 20,
//       backgroundColor: brand.colors.primary,
//       paddingVertical: 10,
//       borderRadius: 10,
//       width:100,
//       borderColor: brand.colors.white, 
//       borderWidth: 2,
//   },
//   buttonText:{
//       color: '#fff',
//       textAlign: 'center',
//       fontWeight: '700'
//   }
 
// });


// define your styles
const styles = StyleSheet.create({
    container: {
        //flex: 1,
        backgroundColor: brand.colors.white
    },
    logoContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo: {
        position: 'absolute',
        // width: 400,
        // height: 200
        maxHeight: 150,
        maxWidth: 150,
        marginTop: 150
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
        marginBottom: 10,
        padding: 10,
        color: brand.colors.primary,
        borderColor: brand.colors.primary, 
        borderWidth: 1,
        borderRadius: 10
    },
    inputFlex: {
      flexGrow: 1
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
    statusIcon: {
      marginLeft: 10
    }

   
});

//make this component available to the app
export default Password;