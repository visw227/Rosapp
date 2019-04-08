

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

import * as Progress from 'react-native-progress'

import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import brand from '../../Styles/brand'
import Styles from './Styles'


import appConfig from '../../app-config.json'


import { Authorization } from '../../Helpers/Authorization';




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

    // headerRight : 
    //   <View style={{
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     height: 40,
    //     paddingRight: 10,
    //     width: '100%'
    //   }}>

    //     <FontAwesome
    //         name="window-restore"
    //         size={20}
    //         color={brand.colors.white}
    //         style={{ marginRight: 10 }}
    //         onPress={ navigate.navigation.getParam('toggleClientModal') }
    //     />

    //   </View>,

  })


  constructor(props) {
      super(props);

      // console.log("Dashboard props.screenProps", JSON.stringify(props.screenProps, null, 2))


      this.state = {
          sending: false,
          receiving: true,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userData: this.props.screenProps.state.userData,
          selectedClient: this.props.screenProps.state.selectedClient
      }


  }




  // this will catch any global state updates - via screenProps
  componentWillReceiveProps(nextProps){

    let selectedClient = nextProps.screenProps.state.selectedClient
    let token = nextProps.screenProps.state.userData.token
    let backgroundColor = nextProps.screenProps.state.backgroundColor

    if(backgroundColor !== this.props.screenProps.state.backgroundColor){

      this.props.navigation.setParams({ backgroundColor: backgroundColor })

    }


        // ONLY if something has changed
    if(token !== this.state.userData.token){

      console.log("Dashboard picked up new token: ", token)
      
      let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

      let source = {
        uri: "https://" + selectedClient + "." + env + "/WebFocus/Dashboard/847C5BE8-3B46-497D-B819-E8F78738A13B",
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

      console.log("Dashboard picked up new selectedClient: ", selectedClient)

      this.props.navigation.setParams({ title: selectedClient })

      let userData = this.props.screenProps.state.userData
      
      let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

      let source = {
        uri: "https://" + selectedClient + "." + env + "/WebFocus/Dashboard/847C5BE8-3B46-497D-B819-E8F78738A13B",
        headers: {
          "managerAppToken":  userData.token
        }
      }
      
      console.log("source updated: ", JSON.stringify(source, null, 2))

      
      this.setState({ 
        selectedClient: selectedClient,
        source: source
      });


    }

  }


  componentDidMount() {

    // hijack the route here when developing specific features
    this.props.navigation.navigate('SupportRequest')


    let _this = this 

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      title: this.props.screenProps.state.selectedClient,
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

    console.log("----------------- Dashboard ----------------------")
    console.log("Authorization.VerifyToken",this.props.screenProps.state.selectedClient, userData.token)


    // this provides shared logging via screenProps
    this.props.screenProps._globalLogger(true, "Dashboard", "Verify Token", { token: userData.token })


    // this verifies that the token is still valid and redirects to login if not
    Authorization.VerifyToken(this.props.screenProps.state.selectedClient, userData.token, function(err, resp){

      if(err) {

        console.log(">>> Dashboard - Invalid Token", err)

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

        console.log(">>> Dashboard - Token is Valid", resp)

        // this provides shared logging via screenProps
        _this.props.screenProps._globalLogger(true, "Dashboard", "Token is valid", { response: resp })


        let source = {
          uri: "https://" + _this.props.screenProps.state.selectedClient + "." + env + "/WebFocus/Dashboard/847C5BE8-3B46-497D-B819-E8F78738A13B",
          headers: {
            "managerAppToken":  userData.token
          }
        }


        console.log(">>> Dashboard source", JSON.stringify(source, null, 2))


        _this.setState({
          userData: userData,
          source: source
        })

      }


    })





    
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

                //Enable Javascript support
                //javaScriptEnabled={true}
                //For the Cache
                //domStorageEnabled={true}

                startInLoadingState = {true}
                
                //onLoadProgress={e => console.log(e.nativeEvent.progress)}
                renderLoading={this._renderLoading}
                injectedJavaScript = { hideSiteNav } 
                style={{ flex: 1 }}
              />
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
  
  }
});

//make this component available to the app
export default DashboardScreen;