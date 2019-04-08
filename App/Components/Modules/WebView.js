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

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',

    // headerRight : 
    //   <View style={{
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     height: 40,
    //     paddingRight: 10,
    //     width: '100%'
    //   }}>

    //     <FontAwesome
    //         name={typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.starIcon) === 'undefined' ? 'star-o': navigate.navigation.state.params.starIcon}
    //         size={20}
    //         color={brand.colors.white}
    //         style={{ marginRight: 10 }}
    //         onPress={ navigate.navigation.getParam('toggleFavorite') }
    //     />

    //   </View>,


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

  componentDidMount () {

    let _this = this

    const { navigation } = this.props;

    const item = navigation.getParam('item', { } );

    this.props.navigation.setParams({ 
      title: item.name ,
      backgroundColor: this.props.screenProps.state.backgroundColor,
      starIcon: 'star-o',
      toggleFavorite: this.toggleFavorite 
    });

    // let isFavorite = false
    // getFavorites(function(items){

    //   // console.log("item.id", item.Menu_Function_ID, "items", items)

    //   if(items.includes(item.id)) {
    //     isFavorite = true
    //     _this.props.navigation.setParams({ starIcon: 'star' })
    //   }


    //   _this.setState({
    //     item: item,
    //     href: item.href,
    //     isFavorite: isFavorite
    //   })


    // })


    let userData = this.props.screenProps.state.userData

    let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com


    console.log("----------------- Modules WebView ----------------------")
    console.log("Authorization.VerifyToken", this.props.screenProps.state.selectedClient, userData.token)

    // this verifies that the token is still valid and redirects to login if not
    Authorization.VerifyToken(this.props.screenProps.state.selectedClient, userData.token, function(err, resp){

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
          uri: "https://" + _this.props.screenProps.state.selectedClient + "." + env + item.href,
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

  }


  // this will catch any global state updates - via screenProps
  componentWillReceiveProps(nextProps){


    const { navigation } = this.props;

    const item = navigation.getParam('item', { } );


    let selectedClient = nextProps.screenProps.state.selectedClient
    let token = nextProps.screenProps.state.userData.token
    let backgroundColor = nextProps.screenProps.state.backgroundColor

    console.log(">>>> selectedClient", selectedClient, "token", token)

    if(backgroundColor !== this.props.screenProps.state.backgroundColor){

      this.props.navigation.setParams({ backgroundColor: backgroundColor })

    }


        // ONLY if something has changed
    if(token !== this.state.userData.token){

      console.log("Modules WebView picked up new token: ", token)
      
      let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

      let source = {
        uri: "https://" + selectedClient + "." + env + item.href,
        headers: {
          "managerAppToken":  token
        }
      }
      
      console.log("source updated: ", JSON.stringify(source, null, 2))

      
      this.setState({ 
        source: source
      });

    }

    // ONLY if something has changed
    if(selectedClient !== this.state.selectedClient){

      console.log("Modules WebView picked up new selectedClient: ", selectedClient)

      this.props.navigation.setParams({ title: selectedClient })

      let userData = this.props.screenProps.state.userData
      
      let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

      let source = {
        uri: "https://" + selectedClient + "." + env + item.href,
        headers: {
          "managerAppToken":  token
        }
      }
            
      console.log("source updated: ", JSON.stringify(source, null, 2))

      this.setState({ 
        selectedClient: selectedClient,
        source: source
      });


    }

  }



  swapFavoriteIcon = () => {

    // emptyFavorites(function(data){

    // })

    if(this.state.isFavorite) {

      // save favorite
      saveFavorite(true, this.state.item.id, function(data){

        console.log("favorites after add:", data)

      })

      console.log("toggle on")
      this.props.navigation.setParams({ starIcon: 'star' })
    }
    else {

      // remove favorite
      saveFavorite(false, this.state.item.id, function(data){

        console.log("favorites after removing:", data)

      })

      console.log("toggle off")
      this.props.navigation.setParams({ starIcon: 'star-o' })
    }
  }
  toggleFavorite = () => {

    // swap icon AFTER state has been changed
    this.setState({
      isFavorite: !this.state.isFavorite
    }, () => this.swapFavoriteIcon() );

  }

    _renderLoading = () => {
    //   return (

    //     <Progress.Bar progress={0.4} width={700} />

    //   )
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