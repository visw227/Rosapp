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



class Profile extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Profile',

    // these seem to ONLY work here
    headerStyle: { backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
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
        userData: null,
        jobTitle: ''

    }


  }

  handleSubmit = () => {

    // Alert.alert(
    //   'Please Confirm',
    //   'Are you sure that you would like to send this alert?',
    //   [
    //     {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
    //     {text: 'Yes', onPress: () => this.sendRequest() },
    //   ],
    //   { cancelable: false }
    // )

    this.setState({
      sending: true,
      requestStatus: {
          hasError: false,
          message: ""
      },
    })

    setTimeout(this.confirmChange, 500);


  }

  confirmChange = () => {

    this.setState({
      sending: false,
      requestStatus: {
          hasError: false,
          message: "Your profile has been updated."
      },
    })

  }

  componentWillMount () {

  }


  componentDidMount () {

    // let userData = this.props.screenProps.state.userData

    // this.props.navigation.setParams({ 
    //   handleSubmit: this.handleSubmit,
    //   backgroundColor:this.props.screenProps.state.backgroundColor 
    // })

  }





  render() {




    return (


            <KeyboardAvoidingView behavior="padding" style={styles.container}>


                <View style={styles.formContainer}>
       

                    <Text style={styles.inputLabel} >New Password</Text>

                    <TextInput style={styles.input} 
                                autoCapitalize="none" 
                                //onSubmitEditing={() => this.passwordInput.focus()} 
                                autoCorrect={false} 
                                keyboardType='default' 
                                returnKeyType="go" 
                                placeholder='Job Title'
                                placeholderTextColor={brand.colors.silver}
                                value={this.state.jobTitle}
                                //onChangeText={(text) => this.setState({jobTitle: text})}
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
    }

   
});



//make this component available to the app
export default Profile;