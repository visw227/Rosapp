import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,TouchableHighlight,ScrollView,
  TextInput,AsyncStorage
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from './Styles'

import ImagePicker from 'react-native-image-picker'
import {reportIssue } from '../../../Services/Support'

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


  })

  constructor(props) {
    super(props)

    let avatarUrl = null

       
    let deviceId = DeviceInfo.getUniqueID()
    let version = DeviceInfo.getVersion()
    let build = DeviceInfo.getBuildNumber()
    let osVersion = DeviceInfo.getSystemVersion()
    let brand = DeviceInfo.getBrand()
    let model = DeviceInfo.getModel()
 
    console.log("avatarUrl constructor: " + avatarUrl)

    this.state = {
      // avatarSource: source.uri,
      avatarSource : null,
      uri : null,
      avatarUrl: avatarUrl,
      imageName :null,
      imageData : null,
      deviceId: deviceId,
      version: version,
      build: build,
      appCenterInstallId: '',
      brand : brand,
      osVersion,
      model,
      options,
      deviceInfo : 'deviceId: '+ deviceId +  ', App Version : ' + version + ', brand : '+ brand + ', Model : ' + model + ', OS version :' + osVersion
    }
  }

  componentDidMount() {


    AsyncStorage.getItem('AppCenterInstallId').then((data) => {
        this.setState({
            appCenterInstallId: data
        })
    })
      console.log('<<<deviceInfo',this.state.deviceInfo)
  }

  handleImage = () => {
    ImagePicker.showImagePicker(this.state.options, (response) => {
      console.log('Response = ', response);
     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
     
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
     
        this.setState({
          avatarSource: source,
          imageData : response.data,
          imageName : response.fileName,
          uri : response.uri
        },()=>console.log('<<avatar',this.state.imageData),()=>console.log('<<<ImageData',this.state.imageData));
      }
    })
  }

  onSubmitPress = () => {
    
    var userData = this.props.screenProps.state.userData

    let request = {
      subject : this.state.subject,
      description : this.state.description,
      location : this.state.location,
      browser : this.state.deviceInfo,
      value : this.state.imageData,
      
    }
      reportIssue (userData.selectedSite, userData.token,request, function(err,rsp){
        if(err){
          console.log('<<errror reporting Issue',err)
        }
        else {
          console.log('<<<Issue reported successfully')
        }
      })
  }


  render() {

    return (

            <ScrollView>

<View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>

    <Text style={{margin:10,marginTop:30}}>Subject</Text> 
        <TextInput style={styles.input}   
                ref={input => { this.textInput = input }}
                 //returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                 placeholder='What is the issue' 
                 placeholderTextColor={brand.colors.silver}
                 //value={this.state.password}
                 onChangeText={(subject) => this.setState({subject})}
         />

      <Text style={{margin:10}}>Location</Text>
                 
                 <TextInput style={styles.input}   
                         returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                         placeholder='Screen where issue exists' 
                         ref={input => { this.confirmPassInput = input }}
                         //editable = {this.state.validated}
                         placeholderTextColor={brand.colors.silver}
                         //value={this.state.password}
                         onChangeText= {(location) => this.setState({location})}
                 />
   

        <Text style={{margin:10}}>Description</Text>
                 
                 <TextInput style={{height: 70,
                    backgroundColor: '#ffffff',
                    marginBottom: 10,
                    width:'64%',
                    padding: 10,
                    color: brand.colors.primary,
                    borderColor: brand.colors.primary, 
                    borderWidth: 1,
                    borderRadius: 10}}   
                    multiline 
                    returnKeyType="go" //ref={(input)=> this.passwordInput = input} 
                    placeholder='Explain in brief what the issue is' 
                    ref={input => { this.confirmPassInput = input }}
                    placeholderTextColor={brand.colors.silver}
                    onChangeText= {(description) => this.setState({description})}
                  />
                  <View style = {{flexDirection : 'column'}}>

                   {/* <View style ={{flexDirection : 'row',justifyContent:'space-around',alignItems:'center',margin:10}}>

                      <Text style={{margin:10}}>upload supporting image</Text>

                      <TouchableHighlight onPress = {()=>this.handleImage()}>
<Text style={styles.imagebuttonText}> Choose file </Text>
</TouchableHighlight>


                    </View> */}


                  {this.state.imageName !== null ? <TouchableHighlight onPress = {()=>this.handleImage()}>
                  <View  style={{flexDirection:'row',justifyContent:'center'}}>
                  <Image style={{width: 66, height: 58,flexDirection:'row',justifyContent:'center'}} 
                  source ={{ uri : this.state.uri}}/>
                  </View>
                  </TouchableHighlight> : null }
                  
                  
                  </View>
           

            <TouchableHighlight style={styles.buttonContainer } >
                <Text style={styles.buttonText} 
                onPress = { ()=> this.onSubmitPress(console.log('description',this.state.description)) }>
                Submit
                </Text>
              </TouchableHighlight>
                 
                 </View>

           
            </ScrollView>

    )}
  
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
  imagebuttonText:{
      color: brand.colors.primary,
      textAlign: 'center',
      fontWeight: '700'
  }, 
  buttonText:{
    color: brand.colors.white,
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
export default SupportRequest;