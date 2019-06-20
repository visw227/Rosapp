

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Alert,
  TouchableHighlight,
  Modal,
  Picker,
  WebView,
  ActivityIndicator
} from 'react-native';

//import * as Progress from 'react-native-progress'

import CodeInput from 'react-native-confirmation-code-input';
import { NavigationActions, StackActions } from 'react-navigation'


import brand from '../../Styles/brand';




class PinCodeScreen extends React.Component {

  static navigationOptions = (navigate) => ({

  headerLeft : null,
  headerStyle: {backgroundColor: brand.colors.primary }
    

  })


  constructor(props) {
      super(props);

      this.state = {
          sending: false,
          password : false,
          pinCode : false,
          wrongPin : false,
          inactiveColor : brand.colors.secondary
      
      }


  }

  componentDidMount () {
    this.props.navigation.addListener('willFocus', this.load)
  }

  load = () => {
    this.renderWhat()
    this.refs.codeInputRef1.clear();
  }

  _checkCode = (code) => {

    console.log('code',typeof code.toString())
    console.log('state code',typeof(this.state.code))
    if(this.state.code.indexOf(code) !== -1) {
      this.props.navigation.navigate('Dashboard')
    }
    else {
      this.setState({inactiveColor : brand.colors.danger})
      this.refs.codeInputRef1.clear();
    }
  }

  storeCode = (code) => {

    AsyncStorage.setItem('pinCode',JSON.stringify(code))
    this.props.navigation.navigate('Dashboard')
    this.refs.codeInputRef1.clear();
  }

  onBackspacePressed = () => {
    this.setState ({
      password : false
    })
  }

  navigate = () => {
   
    const resetNav = NavigationActions.navigate({
      routeName: 'LockScreen',
      params: { cancel: 'true' }
      //key: 'LockScreen',
    });
    this.props.navigation.dispatch(resetNav);

  }

  renderWhat = () => {

    AsyncStorage.getItem('pinCode').then((pinCode) => {

      console.log('AsynCStorage : PinCode', pinCode)

      if (pinCode){
 
          this.setState({
            pinCode : true,
            code : pinCode
          })
   

      }
      else {

        this.setState({
          pinCode : false
        })
    
      }
      // this should allow for the back button to appear in the header
      this.props.navigation.navigate(screen)
  

  })


  }

  render() {

    const {navigation} = this.props

    const change = navigation.getParam('change','default')
      return (
       change === 'true' || this.state.pinCode === false ? <View style = {{justifyContent : 'center',alignContent:'center',alignItems : 'center',marginTop :0,backgroundColor:brand.colors.primary}}>
        <Text style={{textAlign:'center',marginTop : 45,fontSize : 15,color : 'white',marginHorizontal:10}}> As an added security measure, enter your device's 4-digit pincode or set a new 4-digit pincode</Text>
        <View style={{backgroundColor:brand.colors.primary,marginTop:20,marginBottom : 30}}>
    <CodeInput
          ref="codeInputRef2"
          secureTextEntry
          ref="codeInputRef1"
          codeLength={4}
          keyboardType="numeric"
          //compareWithCode='AsDW2'
          activeColor= 'white'
          className='border-circle'
          inactiveColor= {brand.colors.secondary}
          autoFocus={true}
          ignoreCase={true}
          inputPosition='center'
          size={50}
          onFulfill={(code) => this.storeCode(code)}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5 }}
        />
    </View>
    
      </View>
      :
      <View style = {{justifyContent : 'center',alignContent:'center',alignItems : 'center',marginTop :0,backgroundColor:brand.colors.primary}}>
      <Text style={{marginTop :30,fontSize : 15,color : 'white'}}>Please enter your pin to view dashboards</Text>
      <View style={{backgroundColor:brand.colors.primary,marginTop:20,marginBottom : 30}}>
      <CodeInput
            ref="codeInputRef2"
            secureTextEntry
            ref="codeInputRef1"
            codeLength={4}
            keyboardType="numeric"
            //compareWithCode= {this.state.code}
            activeColor='white'
            className='border-circle'
            inactiveColor= {this.state.inactiveColor}
            autoFocus={true}
            ignoreCase={true}
            inputPosition='center'
            size={50}
            onFulfill={(code) => this._checkCode(code)}
            containerStyle={{ marginTop: 30 }}
            codeInputStyle={{ borderWidth: 1.5 }}
          />

<TouchableOpacity 
        style={ styles.buttonContainer }
        onPress={()=>(this.navigate())}>
        <Text 
        style={ styles.buttonText }>
        Forgot PinCode
        </Text>
    </TouchableOpacity> 
          
      </View>
  
      
        </View>
      )

  } // end render

}

const styles = StyleSheet.create({
  container: {
   padding: 20
  },
  input:{
      height: 40,
      backgroundColor: '#ffffff',
      marginBottom: 10,
      padding: 10,
      color: brand.colors.primary,
      borderColor: brand.colors.primary, 
      borderWidth: 1,
      borderRadius: 10
  },
  buttonContainer:{
      marginBottom : 50,
      backgroundColor: brand.colors.primary,
      paddingVertical: 15,
      paddingLeft : 20,
      paddingRight : 20,
      borderRadius: 30,
      borderColor: brand.colors.white, 
      borderWidth: 2,
  },
  buttonText:{
      color: 'white',
      textAlign: 'center',
      fontWeight: '700'
  }, 
  buttonDisabledContainer:{
      marginTop: 20,
      backgroundColor: brand.colors.primary,
      paddingVertical: 15,
      borderRadius: 30,
      borderColor: brand.colors.white, 
      borderWidth: 2,
      opacity: .1
  }
 
});

//make this component available to the app
export default PinCodeScreen;