//import liraries
import React, { Component } from 'react';
import { 
    View, 
    Text, 
    Image, 
    Alert, 
    StyleSheet,
    KeyboardAvoidingView,
    AsyncStorage,
    TextInput,
    Platform
 } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'


import { createStackNavigator, createDrawerNavigator } from 'react-navigation'

import brand from '../App/Styles/brand'

let fakedData = require('../App/Fixtures/UserProfile')

import { List, ListItem, Avatar } from 'react-native-elements'

// hide warnings for now...
console.disableYellowBox = true;

// create a component
class Profile extends Component {



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
          Submit
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
          userToken: '',
          userProfile: fakedData,
          email: fakedData.email,
          phone: fakedData.phone,
          shareEmail: fakedData.shareEmail,
          sharePhone: fakedData.sharePhone
      }


  }

    handleLoginResponse = (response, redirect) => {

        console.log("response passed back to login screen:", JSON.stringify(response, null, 2))

        if(redirect) {

            // this shows a back arrow, so don't use this
            //this.props.navigation.navigate('TabStack')
            // instead, reset the navigation
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: redirect })],
            });
            this.props.navigation.dispatch(resetAction);

        }
        else if(response && response.token) {

            // this shows a back arrow, so don't use this
            //this.props.navigation.navigate('TabStack')
            // instead, reset the navigation
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
            });
            this.props.navigation.dispatch(resetAction);

        }

    }

    handleForgotPassword = () => {

        // this should allow for the back button to appear in the header
        this.props.navigation.navigate('ForgotPassword')

    }

    getForm = () => {

        return (

            <View>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
          
          <View style={styles.body}>
            <View style={styles.bodyContent}>

              <Text style={styles.photoLink}>Change Photo</Text>
              <Text style={styles.name}>John Doe</Text>




            </View>

            <TextInput style={styles.input} 
                autoCapitalize="none" 
                onSubmitEditing={() => this.passwordInput.focus()} 
                autoCorrect={false} 
                keyboardType='email-address' 
                returnKeyType="next" 
                placeholder='Email Address'
                value={this.state.email}
                onChangeText={(text) => this.setState({email: text})}
            />

            <TextInput style={styles.input} 

                placeholder='Phone Number'
                value={this.state.phone}
                onChangeText={(text) => this.setState({email: text})}
            />


            <View style={{ marginLeft: 10, marginRight: 10 }}>
              <ListItem
                  containerStyle={{ borderBottomColor: 'white', borderTopColor: 'white' }}
                  switchButton
                  switched={true}
                  hideChevron
                  title={'Share Email'}
                  onSwitch={ (e) => console.log(e) }

              />
      
              <ListItem
                  containerStyle={{ borderBottomColor: 'white', borderTopColor: 'white' }}
                  switchButton
                  switched={true}
                  hideChevron
                  title={'Share Phone'}
                  onSwitch={ (e) => console.log(e) }

              />
            </View>
       
        </View>
            </View>

        )
    }

    render() {

        const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0

        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={keyboardVerticalOffset}>

                <View style={styles.imageContainer}>
                    <Image resizeMode="contain" style={styles.logo} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}} />
                </View>
                <View style={styles.formContainer}>
                    {this.getForm()}
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
    imageContainer:{
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center',
        backgroundColor: brand.colors.secondary,
    },
    logo: {
        position: 'absolute',
        // width: 400,
        // height: 200
    },
    title:{
        color: "#FFF",
        marginTop: 120,
        width: 180,
        textAlign: 'center',
        opacity: 0.9
    },
    formContainer: {
               flexGrow: 1,
        marginBottom: 100
    },


  header:{
    backgroundColor: brand.colors.secondary,
    height:130,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:60
  },
      input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 10,
        padding: 10,
        color: brand.colors.gray,
        borderColor: brand.colors.silver, 
        borderWidth: 1,
        borderRadius: 5
    },
  name:{
    fontSize:22,
    color:brand.colors.gray,
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    // flex: 1,
    alignItems: 'center',
    padding:30,
  },
  photoLink:{
    fontSize:16,
    color: brand.colors.secondary,
    marginTop:5,
    marginBottom: 5
  },
  name:{
    fontSize:28,
    color: brand.colors.gray,
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: brand.colors.gray,
    marginTop:10
  },
  description:{
    fontSize:16,
    color: brand.colors.gray,
    marginTop:10,
    textAlign: 'center'
  }

});


let Stack = createStackNavigator({ Profile });

export default Stack