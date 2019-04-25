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
  ActivityIndicator
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'
import brand from '../../Styles/brand'
import Styles from './Styles'
import * as Progress from 'react-native-progress'
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
          selectedClient: this.props.screenProps.state.selectedClient
      }

  }

  loadMenuItem = (callback) => {

    let _this = this

    const { navigation } = this.props;

    const item = navigation.getParam('item', null );


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



  componentDidMount () {

    let _this = this

    this.loadMenuItem(function(item){


      _this.props.navigation.setParams({ 
        title: item.name ,
        backgroundColor: _this.props.screenProps.state.backgroundColor,
        starIcon: 'star-o',
        toggleFavorite: _this.toggleFavorite 
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

          let source = {
            uri: "https://" + _this.props.screenProps.state.selectedClient + "." + env + item.href + '?isApp=true',
            headers: {
              "managerAppToken":  userData.token
            }
          }

          console.log("Modules Webview source", JSON.stringify(source, null, 2))

          _this.setState({
            source: source
          })

        }



      })



    })



  }


  // this will catch any global state updates - via screenProps
  componentWillReceiveProps(nextProps){

    let _this = this


    this.loadMenuItem(function(item){


      let selectedClient = nextProps.screenProps.state.selectedClient
      let token = nextProps.screenProps.state.userData.token
      let backgroundColor = nextProps.screenProps.state.backgroundColor

      console.log(">>>> selectedClient", selectedClient, "token", token)

      if(backgroundColor !== _this.props.screenProps.state.backgroundColor){

        _this.props.navigation.setParams({ backgroundColor: backgroundColor })

      }


          // ONLY if something has changed
      if(token !== _this.state.userData.token){

        console.log("Modules WebView picked up new token: ", token)
        
        let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

        let source = {
          uri: "https://" + selectedClient + "." + env + item.href + '?isApp=true',
          headers: {
            "managerAppToken":  token
          }
        }
        
        console.log("source updated: ", JSON.stringify(source, null, 2))

        
        _this.setState({ 
          source: source
        });

      }

      // ONLY if something has changed
      if(selectedClient !== _this.state.selectedClient){

        console.log("Modules WebView picked up new selectedClient: ", selectedClient)

        _this.props.navigation.setParams({ title: selectedClient })

        let userData = _this.props.screenProps.state.userData
        
        let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

        let source = {
          uri: "https://" + selectedClient + "." + env + item.href + '?isApp=true',
          headers: {
            "managerAppToken":  token
          }
        }
              
        console.log("source updated: ", JSON.stringify(source, null, 2))

       _this.setState({ 
          selectedClient: selectedClient,
          source: source
        });


      }



    })



  }


  _renderLoading = () => {
    return (
        <ActivityIndicator
            color={brand.colors.primary}
            size='large'
            style={styles.ActivityIndicatorStyle}
        />
    )
  }


  render() {


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
            source={this.state.source}
            startInLoadingState = {true}
            //onLoadProgress={e => console.log(e.nativeEvent.progress)}
            renderLoading={this._renderLoading}
            injectedJavaScript={ hideSiteNav } 
            style={{ flex: 1 }}
          />
        }

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
  
  }
});


//make this component available to the app
export default WebViewScreen;