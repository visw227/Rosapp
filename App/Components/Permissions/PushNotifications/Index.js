import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Platform, Image, AsyncStorage } from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import logo from '../../../Images/logo-lg-white-square.png';
import logo_QA from '../../../Images/logo-lg-white-square-QA.png';
import logo_DEV from '../../../Images/logo-lg-white-square-DEV.png';

import Push from 'appcenter-push'



class PushNotifications extends React.Component {


  static navigationOptions = (navigate) => ({

    header: null

  })

  constructor(props) {
      super(props);

      this.state = {
        isQA: this.props.screenProps.state.isQA,
        isLocal : this.props.screenProps.state.isLocal
      }

  }



  keepGoing = () => {

    const resetAction = StackActions.reset({
        index: 0,
        key: null, // this is the trick that allows this to work
        actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
    });
    this.props.navigation.dispatch(resetAction);

  }


  onAllow = () => {

    // only set this flag here so that we can ask again later
    AsyncStorage.setItem('askedToSendPushNotifs', '1')

    // do something to show the device permission dialog 
    Push.setEnabled(true)
    
    this.keepGoing()

  }
  
  onDontAllow = () => {

    // dont trigger the device permission dialog - save that for another time

    this.keepGoing()

  }



render() {

    chooseLogo = () => {
        if(this.state.isQA) {
            return (
                <Image source={logo_QA} style={styles.logo} />

            )
        }
        else if (this.state.isLocal) {
          return (
              <Tex style={{color : brand.colors.danger}}> Local </Tex> 
         )
      }
        else {
            return (
                <Image source={logo} style={styles.logo} />

            )
        }
    }


    return (
      <View style={styles.container}>


        {chooseLogo()}



        <Text style={styles.text}>
          To help you stay more connected to your restaurant operations, Rosnet would like to send you push notifications.
        </Text>

        <View style={styles.buttonGroup}>
            <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={this.onAllow}>
                <Text  style={styles.buttonText}>Allow Push Notifications</Text>
            </TouchableOpacity> 

            <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={this.onDontAllow}>
                <Text  style={styles.buttonText}>Maybe Later</Text>
            </TouchableOpacity> 
        </View>

      </View>
    );
  }

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 20,
        backgroundColor: brand.colors.primary,
        paddingLeft: 20,
        paddingRight: 20
    },
    h1: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 30
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 50
    },

    logo: {
        // position: 'absolute',
        // width: 400,
        // height: 200
        maxHeight: 200,
        maxWidth: 200
    },
    buttonGroup: {
        flex: 0
    },
    buttonContainer:{
        backgroundColor: brand.colors.primary,
        paddingVertical: 15,
        borderRadius: 30,
        borderColor: brand.colors.white, 
        borderWidth: 2,
        width: 300,
        marginBottom: 10
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontSize: 15
    }
});


//make this component available to the app
export default PushNotifications;