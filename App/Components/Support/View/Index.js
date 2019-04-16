import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
    WebView,
  ActivityIndicator
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from './Styles'

import { NavigationActions, StackActions } from 'react-navigation'

import { Authorization } from '../../../Helpers/Authorization';

import appConfig from '../../../app-config.json'


class SupportView extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'My Requests',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
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
          uri: "https://rosnet.zendesk.com/hc/en-us/requests",
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
        uri: "https://rosnet.zendesk.com/hc/en-us/requests",
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



  render() {

    return (

      <View style={{ backgroundColor: '#ffffff', height: '100%' }}>

        {this.state.source &&
        <WebView
            source={this.state.source}
            startInLoadingState = {true}
            //onLoadProgress={e => console.log(e.nativeEvent.progress)}
            renderLoading={this._renderLoading}
            //injectedJavaScript={ hideSiteNav } 
            style={{ flex: 1 }}
          />
        }

      </View>

    );

  }
  
}



//make this component available to the app
export default SupportView;