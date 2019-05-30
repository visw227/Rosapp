

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

import { NavigationActions, StackActions } from 'react-navigation'

import { List, ListItem, Avatar } from 'react-native-elements'

//import * as Progress from 'react-native-progress'
import firebase from 'react-native-firebase'

import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'

import brand from '../../Styles/brand'
import Styles from './Styles'


import appConfig from '../../app-config.json'


import { Authorization } from '../../Helpers/Authorization';
import{updateFcmDeviceToken} from '../../Services/Push'
import { AsapScheduler } from 'rxjs/internal/scheduler/AsapScheduler';




class DashboardScreen extends React.Component {

  static navigationOptions = (navigate) => ({

    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Dashboard': navigate.navigation.state.params.title,

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.toggleDrawer() }
    />,

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
          selectedClient: this.props.screenProps.state.selectedClient,
          backArrowEnabled: false,
          forwardArrowEnabled: false,
          fcmToken: null,
          appInstallId: null
      }


  }


  componentDidMount() {

    _this = this

    //console.log("Dashboard is comp did mount")

    // componentDidMount only fires once
    // willFocus instead of componentWillReceiveProps
    this.props.navigation.addListener('willFocus', this.load)


      
    _this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(fcmToken => {
        console.log('DSashboard : token refreshed %%%%%%%*********%%%%%%%')
        //_this._onChangeToken(fcmToken)
    });

    AsyncStorage.getItem('userData').then((data) => {


      //console.log("LoginForm userData", data)

      if(data) {
          
          let userData = JSON.parse(data)
          _this.setState({
              userName: userData.userName,
              userData: userData
          })
      }

      AsyncStorage.getItem('deviceInfo').then((data) => {
        let deviceInfo = JSON.parse(data)
        appInstallId = deviceInfo.appInstallId
       

        AsyncStorage.getItem('firebaseToken').then((token) => {
          let fcmToken = token
          if(deviceInfo && fcmToken){
            let request = {
              appInstallId : deviceInfo.appInstallId,
              fcmDeviceToken : fcmToken,
              userId : _this.state.userData.userId,
              token : _this.state.userData.token,
              client : _this.props.screenProps.state.selectedClient
            }
            console.log('Dash req:',request)
            updateFcmDeviceToken(request,function(err,resp){
              if(err){
                console.log("UpdateFCMDash Error",err)
              }
              else{
                console.log("updated fcm",resp)
              }
            })
          }
        })
       
      })
  })


  }


  // willFocus doesn't always fire
  // this will catch any global state updates - via screenProps
  // componentWillReceiveProps(nextProps){

  //     let backgroundColor = nextProps.screenProps.state.backgroundColor

  //     if(backgroundColor !== this.props.screenProps.state.backgroundColor){

  //       this.props.navigation.setParams({ 
  //         backgroundColor: backgroundColor 
  //       })

  //     }

  // }

  load = () => {

    console.log("Dasbboard - load...")

    let _this = this 

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      title: this.props.screenProps.state.selectedClient,
      backgroundColor: this.props.screenProps.state.backgroundColor 
    })

    let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

    //console.log("----------------- Dashboard ----------------------")
    //console.log("Authorization.VerifyToken",this.props.screenProps.state.selectedClient, userData.token)


    // this provides shared logging via screenProps
    this.props.screenProps._globalLogger(true, "Dashboard", "Verify Token", { token: userData.token })


    // this verifies that the token is still valid and redirects to login if not
    Authorization.VerifyToken(this.props.screenProps.state.selectedClient, userData.token, function(err, resp){

      if(err) {

        //console.log(">>> Dashboard - Invalid Token", err)

        // this provides shared logging via screenProps
        _this.props.screenProps._globalLogger(false, "Dashboard", "Token is INVALID", { error: err })

        // reset the navigation
        const resetAction = StackActions.reset({
            index: 0,
            key: null, // this is the trick that allows this to work
            actions: [NavigationActions.navigate({ routeName: 'LoginStack' })],
        });
        _this.props.navigation.dispatch(resetAction);


      }
      else {

        //console.log(">>> Dashboard - Token is Valid", resp)

        // this provides shared logging via screenProps
        _this.props.screenProps._globalLogger(true, "Dashboard", "Token is valid", { response: resp })


        let source = {
          uri: "https://" + _this.props.screenProps.state.selectedClient + "." + env + "/home/appdash?isApp=true",
          headers: {
            "managerAppToken":  userData.token
          }
        }


        //console.log(">>> Dashboard source", JSON.stringify(source, null, 2))


        _this.setState({
          userData: userData,
          source: source // DONT change this in onNavigationStateChange
        })

      }


    })





  }

  onNavigationStateChange = (navState) => {

    //console.log("onNavigationStateChange", navState)

    this.setState({
        backArrowEnabled: navState.canGoBack,
        forwardArrowEnabled: navState.canGoForward,
    });

    // hijack the current item and save it with a new title and url - just in case app launches from here 
    // let item = {
    //   name: navState.title,
    //   url: navState.url,
    //   deepLink: true // only set when hijacking the url by moving around in the web view
    // }

    // AsyncStorage.setItem('selectedMenuItem', JSON.stringify(item))


    // this.props.navigation.setParams({ 
    //   title: navState.title
    // });


  }


 
  showLoadingIndicator = () => {

      return (
          <ActivityIndicator
              color={brand.colors.primary}
              size='large'
              style={styles.ActivityIndicatorStyle}
          />
      )
  }

  onBackArrowPress = () => {
    //console.log("goBack")
    this.refs['webview'].goBack()
  }
  onForwardArrowPress = () => {
    //console.log("goForward")
    this.refs['webview'].goForward()
  }

  render() {

      const hideSiteNav = `
      let x = document.getElementsByTagName('nav')
      if(x.length > 0) {
        x[0].style.display = "none";
      }
      `;
      

      return (
        
          <View style={{ backgroundColor: '#ffffff', height: '100%' }}>

            {this.state.source &&
              <WebView
                ref={'webview'}
                source={this.state.source}

                //Enable Javascript support
                //javaScriptEnabled={true}
                //For the Cache
                //domStorageEnabled={true}

                startInLoadingState = {true}
                
                //onLoadProgress={e => //console.log(e.nativeEvent.progress)}
                renderLoading={this.showLoadingIndicator}
                injectedJavaScript = { hideSiteNav } 
                style={{ flex: 1 }}
                onNavigationStateChange={this.onNavigationStateChange}
              />

            }

            {this.state.source && (this.state.backArrowEnabled || this.state.forwardArrowEnabled) &&
              
              <View style={styles.toolBar}>


                <SimpleLineIcon
                    disabled={!this.state.backArrowEnabled}
                    name="arrow-left"
                    size={25}
                    color={brand.colors.gray}
                    style={[styles.toolBarIcon, { paddingLeft: 10 }]}
                    onPress={this.onBackArrowPress}
                />

                <SimpleLineIcon
                    disabled={!this.state.forwardArrowEnabled}
                    name="arrow-right"
                    size={25}
                    color={brand.colors.gray}
                    style={[styles.toolBarIcon, { paddingRight: 10 }]}
                    onPress={this.onForwardArrowPress}
                />

              </View>
            }

          </View>

      ) // end return




  } // end render

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    backgroundColor: brand.colors.white,
    paddingLeft: 40,
    paddingRight: 40
  },
    logoContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        // position: 'absolute',
        // width: 400,
        // height: 200
    },
  text: {
    fontSize: 18,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 50,
    backgroundColor: brand.colors.secondary,
    borderRadius: 5,
    marginTop: 80
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'   
  },
  ActivityIndicatorStyle:{
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
  
  },

  toolBar: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    borderColor: 'white',
    backgroundColor: brand.colors.lightGray
  },

  toolBarIcon: {
    // width:20,
    // height:20,
    // opacity: 0.9

  },

});

//make this component available to the app
export default DashboardScreen;