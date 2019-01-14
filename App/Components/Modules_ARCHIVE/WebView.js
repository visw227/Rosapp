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
  WebView
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'
import brand from '../../Styles/brand'
import Styles from './Styles'
import * as Progress from 'react-native-progress'
import { getFavorites, saveFavorite, emptyFavorites } from '../../Lib/Favorites';

import appConfig from '../../app-config.json'


class WebViewScreen extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Modules': navigate.navigation.state.params.title,

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

        <FontAwesome
            name={typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.starIcon) === 'undefined' ? 'star-o': navigate.navigation.state.params.starIcon}
            size={20}
            color={brand.colors.white}
            style={{ marginRight: 10 }}
            onPress={ navigate.navigation.getParam('toggleFavorite') }
        />

      </View>,


  })

  constructor(props) {
      super(props);

      // console.log("Modules webview props.screenProps", JSON.stringify(props.screenProps, null, 2))

      this.state = {
          sending: false,
          receiving: false,
          data: [],
          isFavorite: false,
          href: "",
          item: { Menu_Function_ID: "" }
      }

  }

  componentDidMount () {

    let _this = this

    const { navigation } = this.props;

    const item = navigation.getParam('item', { } );

    this.props.navigation.setParams({ title: item.Name })

    this.props.navigation.setParams({ starIcon: 'star-o' })
    this.props.navigation.setParams({ toggleFavorite: this.toggleFavorite });

    let isFavorite = false
    getFavorites(function(items){

      // console.log("item.id", item.Menu_Function_ID, "items", items)

      if(items.includes(item.Menu_Function_ID)) {
        isFavorite = true
        _this.props.navigation.setParams({ starIcon: 'star' })
      }


      _this.setState({
        item: item,
        href: item.href,
        isFavorite: isFavorite
      })


    })


    // get userData from local storage
    AsyncStorage.getItem('userData').then((data) => {

      let userData = JSON.parse(data)

      console.log(">> userData", JSON.stringify(userData, null, 2))


      let clientCode = userData.selectedSite
      let env = appConfig.WEB_HOST // rosnetdev.com, rosnetqa.com, rosnet.com


      let source = {
        uri: "https://" + clientCode + "." + env + this.state.href,
        headers: {
          "Cookie": "rememberme=" + userData.userName + "; clientCode=" + clientCode + "; rosnetToken=" + userData.token 
        }
      }


      console.log("Modules webview source", JSON.stringify(source, null, 2))


      _this.setState({
        userData: userData,
        source: source
      })

    })



  }

  swapFavoriteIcon = () => {

    // emptyFavorites(function(data){

    // })

    if(this.state.isFavorite) {

      // save favorite
      saveFavorite(true, this.state.item.Menu_Function_ID, function(data){

        console.log("favorites after add:", data)

      })

      console.log("toggle on")
      this.props.navigation.setParams({ starIcon: 'star' })
    }
    else {

      // remove favorite
      saveFavorite(false, this.state.item.Menu_Function_ID, function(data){

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
    return (
     
      <Progress.Bar progress={0.4} width={700} />
  
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
            onLoadProgress={e => console.log(e.nativeEvent.progress)}
            renderLoading={this._renderLoading}
            injectedJavaScript={ hideSiteNav }
            style={{ flex: 1 }}
          />
        }

      </View>


    
    ) // end return

  } // end render

}


//make this component available to the app
export default WebViewScreen;