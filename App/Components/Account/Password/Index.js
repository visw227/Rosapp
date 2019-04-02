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
import { parseUser } from '../../../Helpers/UserDataParser'
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



class Password extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Change Password',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    

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
      secSetting : {}
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

    this.props.navigation.setParams({ title: userData.selectedSite,backgroundColor:this.props.screenProps.state.backgroundColor })


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
  _onChangePassword = (password, isValid) => {
    this.setState({ password: { value: password, isValid: isValid } })
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

  newPassword = (text,isValid) => {

    _this = this

    _this.setState ({
      password: { value: text, isValid: isValid }
    })
  }


  onSubmitPress = (token,strengthLevels) => {

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

        changePassword(request, token, function (err,response){

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
  

  onTestContinue = () => {

    const resetAction = StackActions.reset({
        index: 0,
        key: null, // this is the trick that allows this to work
        actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
    });
    this.props.navigation.dispatch(resetAction);
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

    /*


      NOTE: For now, allowing this page to be used EVEN if the API says they cant
      That way, if the user's login says they need to change their password, we don't have to worry about 
      the other API having a conflicting message
      Plus, the user cant access this page anyway when it's hidden in the menu

    */


//if (this.state.secSetting.Pswd_Change_By_User){
  return (
      

<View style={styles.container}>


        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

            <Text style={{margin:10,marginTop:30}}>Current Password</Text> 
                <View style={{flexDirection :'row'}}>
                <TextInput style={styles.input}   
                        ref={input => { this.textInput = input }}
                         //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
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
                {this.state.currentPassError === true  && <Ionicon name = 'md-close-circle' 
                                size={30}
                                color={brand.colors.danger}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}

                </View>
                
                 
            <Text style={{margin:10}}>New Password</Text>

            <View>
            <PasswordStrengthCheck
                    secureTextEntry
                    minLength={this.state.secSetting.Min_Pswd_Length}
                    value = {this.state.tempPass}
                    ref={input => { this.newPassInput = input }}
                    ruleNames="symbols|words"
                    strengthLevels={strengthLevels}
                    tooShort={tooShort}
                    minLevel={0}
                    barWidthPercent={65}
                    showBarOnEmpty={true}
                    barColor="#CCC"
                    placeholder ={'Text me'}
                    onChangeText={(text, isValid) => this.setState({ password: { value: text, isValid: isValid },levelError : false,tempPass:text })} 
                    />
            </View>
                
                 


            <Text style={{margin:10}}>Confirm Password</Text>
                 
                 <View style={{flexDirection:'row'}}>
                 <TextInput style={styles.input}   
                         returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                         placeholder='Confirm Password' 
                         ref={input => { this.confirmPassInput = input }}
                         //editable = {this.state.validated}
                         placeholderTextColor={brand.colors.silver}
                         secureTextEntry
                         //value={this.state.password}
                         onChangeText= {(text) => this.confirmPassword(text)}
                 />
                 {this.state.passwordConfirmed === true &&<Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.success}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.passwordConfirmed === false && <Ionicon name = 'md-checkmark-circle' 
                                size={30}
                                color={brand.colors.lightGray}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                {this.state.confirmError === true && this.state.confirmPressed && <Ionicon name = 'md-close-circle' 
                                size={30}
                                color={brand.colors.danger}
                                style={{ marginTop:2,position:'absolute',marginLeft:'65%' }}/>}
                 </View>
                
                
                
           {<TouchableHighlight style={styles.buttonContainer } >
                <Text  style={styles.buttonText} onPress = { ()=> this.onSubmitPress(this.props.screenProps.state.userData.token,strengthLevels) }>Submit</Text>
    </TouchableHighlight> }

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


        </View>

        {this.state.changeSuccess &&<Animated.View style = {{flexDirection : 'column',justifyContent:'flex-end',alignItems:'center',marginTop:20,opacity:this.state.fadeAnim}}>
         <Ionicon name = 'md-thumbs-up' 
                                size={60}
                                color={brand.colors.success}
                                style={{ marginTop:10,justifyContent:"center",marginBottom:5 }}/>
          <Animated.Text style={{color : brand.colors.success}}> Password changed successfully!</Animated.Text>
        </Animated.View>}

    
    
    </View>

      
    );
// } 
// else {
//   return (
    


//                            <View style={{flex: 1,
//                               backgroundColor: '#fff',
//                               alignItems: 'center',
//                               justifyContent: 'center'}}>
//                              <AlerMessage title = 'You are not authorized to change your password. Please contact your administrator'/>

//                             <Text 
//                                 style={{ color: brand.colors.primary }} 
//                                 onPress={this.onTestContinue}>
//                                 Continue to Dashboard
//                             </Text>
//                         </View>

//   )
// }
   
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
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
  buttonText:{
      color: '#fff',
      textAlign: 'center',
      fontWeight: '700'
  }
 
});
//make this component available to the app
export default Password;