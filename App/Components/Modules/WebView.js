import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Platform,
  WebView,
  ActivityIndicator,
  Keyboard 
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'


import brand from '../../Styles/brand'
import Styles from './Styles'
//import * as Progress from 'react-native-progress'
import { getFavorites, saveFavorite, emptyFavorites } from '../../Helpers/Favorites';

import appConfig from '../../app-config.json'

import { NavigationActions, StackActions } from 'react-navigation'

import { Authorization } from '../../Helpers/Authorization';


class WebViewScreen extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? '': navigate.navigation.state.params.title,

    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',


    headerLeft : <Ionicon
      name="md-menu"
      size={35}
      color={brand.colors.white}
      style={{ paddingLeft: 10 }}
      onPress={() => navigate.navigation.state.params.menuIconClickHandler(navigate) }

/>,


  })


  
  constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          data: [],
          isFavorite: false,
          href: "",
          item: { Menu_Function_ID: "" },
          userData: this.props.screenProps.state.userData,
          selectedClient: this.props.screenProps.state.selectedClient,
          backArrowEnabled: false,
          forwardArrowEnabled: false,
          webviewNdx: 1,
          homeUrl: ""
      }

  }


  componentDidMount() {

    // componentDidMount only fires once
    // willFocus instead of componentWillReceiveProps
    this.props.navigation.addListener('willFocus', this.load)

  }


  // needed a way to perform multiple actions: 1) Dismiss the keyboard, 2) Open the Drawer
  // this is passed in to navigationOptions as menuIconClickHandler
  onMenuIconClick = (navigate) => {

    navigate.navigation.toggleDrawer()
    Keyboard.dismiss()

  }


  load = () => {

    let _this = this

    this.loadMenuItem(function(item){


      _this.props.navigation.setParams({ 
        title: item.name ,
        backgroundColor: _this.props.screenProps.state.backgroundColor,
        starIcon: 'star-o',
        toggleFavorite: _this.toggleFavorite,
        menuIconClickHandler: _this.onMenuIconClick,
      });



      let userData = _this.props.screenProps.state.userData

      let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com


      console.log("----------------- Modules WebView ----------------------")
      console.log("Authorization.VerifyToken", _this.props.screenProps.state.selectedClient, userData.token)

      // this verifies that the token is still valid and redirects to login if not
      Authorization.VerifyToken(_this.props.screenProps.state.selectedClient, userData.token, function(err, resp){

        if(err) {

          console.log(">>> Modules WebView - Invalid Token", err)

          // reset the navigation
          const resetAction = StackActions.reset({
              index: 0,
              key: null, // this is the trick that allows this to work
              actions: [NavigationActions.navigate({ routeName: 'LoginStack' })],
          });
          _this.props.navigation.dispatch(resetAction);


        }
        else {

          console.log(">>> Modules WebView - Token is Valid", resp)

          // this is a partial (relative) url provided from the modules API
          //let url = "https://" + _this.props.screenProps.state.selectedClient + "." + env + item.href + '?isApp=true'

     

          let homeUrl = "https://" + _this.props.screenProps.state.selectedClient + "." + env + item.href + '?isApp=true'


          console.log('webview Url:',homeUrl)
          // this was a inner-navigation change, with a complete URL, so resume there
          if(item.deepLink ) {
            url = item.url
          }


          let source = {
            uri: homeUrl,
            headers: {
              "webviewNdx": "1",
              "managerAppToken":  userData.token
            }
          }

          console.log("Modules Webview source", JSON.stringify(source, null, 2))

          _this.setState({
            homeUrl: homeUrl,
            source: source,
            item: item
          })

        }



      })



    })



  }


  loadMenuItem = (callback) => {

    let _this = this

    const { navigation } = this.props;

    const item = navigation.getParam('item', null );

    console.log(">>>>> loadMenuItem", item)


    // save a copy to local storage in case the user resumes using the app here - after biometrics
    if(item) {

      console.log("saving selectedMenuItem", item)
      AsyncStorage.setItem('selectedMenuItem', JSON.stringify(item))

      callback(item)
    }
    else {
      
        console.log("loading selectedMenuItem..")

        AsyncStorage.getItem('selectedMenuItem').then((data) => {

            console.log("loaded selectedMenuItem", data)

            if(data) {

              let selectedMenuItem = JSON.parse(data)

              console.log("loaded selectedMenuItem", selectedMenuItem)

              callback(selectedMenuItem)


            }

        })
    }

  }

  onNavigationStateChange = (navState) => {

    console.log("onNavigatinStateChange", navState)

    this.setState({
        backArrowEnabled: navState.canGoBack,
        forwardArrowEnabled: navState.canGoForward,
        webviewNdx: this.state.webviewNdx + 1
    });

    // hijack the current item and save it with a new title and url - just in case app launches from here 
    let item = {
      name: navState.title,
      url: navState.url,
      deepLink: true // only set when hijacking the url by moving around in the web view
    }

    AsyncStorage.setItem('selectedMenuItem', JSON.stringify(item))


    this.props.navigation.setParams({ 
      title: navState.title
    });


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

  onHomePress = () => {
    console.log("onHomePress")

    // webViewNdx is a hack to trick the webview into reloading the original url
    let source = {
      uri: this.state.homeUrl,
      headers: {
        "webViewNdx": (this.state.webviewNdx + 1).toString(),
        "managerAppToken":  this.props.screenProps.state.userData.token
      }
    }

    this.setState({
      webviewNdx: this.state.webviewNdx + 1,
      source: source
    })
  }
  onBackArrowPress = () => {
    console.log("goBack")
    this.refs['webview'].goBack()
  }

  onForwardArrowPress = () => {
    console.log("goForward")
    this.refs['webview'].goForward()
  }



  render() {

    RenderToolbar = () => {

      if(!this.state.source || (this.state.backArrowEnabled === false && this.state.forwardArrowEnabled === false) ) {

        return (<View/>)
      }


      return (

        <View style={styles.toolBar}>

          <SimpleLineIcon
              disabled={!this.state.backArrowEnabled}
              name="arrow-left"
              size={18}
              color={this.state.backArrowEnabled ? brand.colors.gray : brand.colors.white}
              style={[styles.toolBarIcon, { paddingLeft: 10 }]}
              onPress={this.onBackArrowPress}
          />


          <SimpleLineIcon
              name="home"
              size={18}
              color={brand.colors.gray}
              style={[styles.toolBarIcon, { paddingLeft: 10 }]}
              onPress={this.onHomePress}
          />


          <SimpleLineIcon
              disabled={!this.state.forwardArrowEnabled}
              name="arrow-right"
              size={18}
              color={this.state.forwardArrowEnabled ? brand.colors.gray : brand.colors.white}
              style={[styles.toolBarIcon, { paddingRight: 10 }]}
              onPress={this.onForwardArrowPress}
          />


        </View>

      )


    }

    const hideSiteNav = `
      // alert('hello')
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


        <RenderToolbar/>


      </View>


    
    ) // end return

  } // end render

}

const styles = StyleSheet.create({
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
    backgroundColor: 'transparent',
    opacity: 0.9
  },

  toolBarIcon: {
    // width:20,
    // height:20,
    // opacity: 0.9

  },
});


//make this component available to the app
export default WebViewScreen;