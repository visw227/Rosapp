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
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableWithoutFeedback
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

// import Styles from './Styles'

import { updateProfile } from '../../../Services/User';


import AvatarInitials from '../../ReusableComponents/AvatarInitials'

import { List, ListItem, Avatar } from 'react-native-elements'

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
        receiving: true,
        requestStatus: {
            hasError: false,
            message: ""
        },
        userData: this.props.screenProps.state.userData,
        jobTitle: this.props.screenProps.state.userData.jobTitle,
        email: '',
        phone: '',
        Text : 'Viswa',
        shareEmail: false,
        sharePhone: false,
        keyboardVisible: false
    }


  }


  componentDidMount () {

    //let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      handleSubmit: this.handleSubmit,
      backgroundColor: this.props.screenProps.state.backgroundColor 
    })

    if (Platform.OS=='ios'){
        this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
    }
    else{
        this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
    }

  }

  componentWillUnmount () {

      this.keyboardWillShowSub.remove();
      this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {

      this.setState({
          keyboardVisible: true
      })

  };

  keyboardWillHide = (event) => {

      this.setState({
          keyboardVisible: false
      })
  };


  keyboardDidShow = (event) => {

      this.setState({
          keyboardVisible: true
      })

  };

  keyboardDidHide = (event) => {

      this.setState({
          keyboardVisible: false
      })

  };

  handleSubmit = () => {

    Keyboard.dismiss()

    let _this = this

    let userData = this.props.screenProps.state.userData

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    let request = {
      jobTitle: this.state.jobTitle,
      //email: null // this field can be updated only in the support section - when registering a new Zendesk profile
    }

    updateProfile(this.props.screenProps.state.selectedClient, this.props.screenProps.state.userData.token, request, function(err, resp){

      if(err) {

        _this.setState({
          sending: false,
          requestStatus: {
              hasError: true,
              message: err
          },
        })
      }
      else {

        userData.jobTitle = _this.state.jobTitle

        // this shares the persisted userData to the App-Rosnet.js wrapper
        _this.props.screenProps._globalStateChange( { action: "profile-update", userData: userData })


        _this.setState({
          sending: false,
          requestStatus: {
              hasError: false,
              message: "Your profile has been updated."
          },
        })
        
      }


    })

  }





  getAvatar = (item) => {

    // item.photo = 'https://rosqa.stafflinq.com/image-server/profile-pics/13367'

    // console.log("getAvatar: ", item.name, item.userId, item.imagePath)

    // make sure that the imagePath is not null that it matches the userId
    // several were different in dev and QA and caused the image to get a 404, messing up the UI
    if(item.photo && item.photo.length > 0) {
      return (

        <Image 
          key={new Date()} 
          style={styles.avatar} 
          source={{uri: item.photo }}
        />
    
      )
    }
    else {
      return (
          <AvatarInitials
            style={{alignSelf: 'center', marginTop: -55, borderColor: '#ffffff', borderWidth: 1 }}
            backgroundColor={brand.colors.secondary}
            color={'white'}
            size={100}
            fontSize={30}
            text={item.commonName}
            length={2}
          />
      )
    }
  }


  render() {




    return (


      
      <KeyboardAvoidingView behavior="padding" style={styles.container}>

        <View style={styles.header}></View>

        <View style={styles.formContainer}>

          {this.getAvatar(this.props.screenProps.state.userData)}

          <View style={styles.bodyContent}>
            

              {this.state.keyboardVisible === false &&
              <View>
              <Text style={styles.name}>{this.props.screenProps.state.userData.commonName}</Text>

              <Text style={styles.info}>{this.props.screenProps.state.userData.email}</Text>
              <Text style={styles.info}>{this.props.screenProps.state.userData.phone}</Text>
              </View>
              }
    

          </View>

          
             {/* <Text style={styles.inputLabel} >Job Title</Text>  */}

            <TextInput style={styles.input} 
                        autoCapitalize="none" 
                        //onSubmitEditing={() => this.passwordInput.focus()} 
                        autoCorrect={false} 
                        keyboardType='default' 
                        returnKeyType="go" 
                        placeholder='Job Title'
                        placeholderTextColor={brand.colors.silver}
                        value={this.state.jobTitle}
                        onChangeText={(text) => this.setState({jobTitle: text})}
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
        backgroundColor: brand.colors.white
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
    header:{
      backgroundColor: brand.colors.secondary,
      height:70,
    },
    name:{
      fontSize:28,
      color: brand.colors.gray,
      fontWeight: "600"
    },
    info:{
      fontSize:16,
      color: brand.colors.gray,
      marginTop:10,
      marginBottom: 0,
      textAlign: 'center'
    },
    bodyContent: {
      // flex: 1,
      alignItems: 'center',
      padding:20,
    },
   
});



//make this component available to the app
export default Profile;