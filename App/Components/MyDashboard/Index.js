

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
  WebView
} from 'react-native';

import { List, ListItem, Avatar } from 'react-native-elements'

import * as Progress from 'react-native-progress'

import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import brand from '../../Styles/brand'
import Styles from './Styles'


import { getStorageItem } from '../../Lib/StorageHelper'


import LocationButtons from '../ReusableComponents/LocationButtons'


let fakedUserProfile = require('../../Fixtures/UserProfile')


import appConfig from '../../app-config.json'


class MyDashboardScreen extends React.Component {

  static navigationOptions = (navigate) => ({

     title: 'My Dashboard',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
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

      console.log("My Dashboard props.screenProps", JSON.stringify(props.screenProps, null, 2))


      this.state = {
          sending: false,
          receiving: true,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userProfile: fakedUserProfile,
          showClientModal: false,
          selectedSite: "",
          userData: { sites: ["AAG", "DOHERTY"] }
      }


  }



  toggleClientModal = () => {
    this.setState({
      showClientModal: !this.state.showClientModal
    })
  }
  setClientModalVisible(visible) {
    this.setState({modalVisible: visible});
  }


  componentDidMount() {

    let _this = this 

    // get userData from local storage
    AsyncStorage.getItem('userData').then((data) => {

      let userData = JSON.parse(data)

      // sort the list
      userData.sites.sort()

      this.props.navigation.setParams({ title: userData.sites[0] })


      let clientCode = userData.sites[0].toLowerCase()
      let env = appConfig.WEB_HOST // rosnetdev.com, rosnetqa.com, rosnet.com



      let source = {
        uri: "https://" + clientCode + "." + env + "/WebFocus/Dashboard/3A077B2C-0A95-449C-B218-16BF9594F655",
        headers: {
          "Cookie": "rememberme=" + userData.userName + "; clientCode=" + clientCode + "; rosnetToken=" + userData.token 
        }
      }


      console.log("Dashboard source", JSON.stringify(source, null, 2))


      _this.setState({
        userData: userData,
        source: source
      })

    })


    
  }


 
 

  render() {



      const hideSiteNav = `
        // alert('hello')
        let x = document.getElementsByTagName('nav')
        if(x.length > 0) {
          x[0].style.display = "none";
        }

        // x = document.getElementsByClassName('well')
        // alert(x.length + ' wells...')
        // if(x.length > 0) {
        //   x[0].style.display = "none";
        //   x[1].style.display = "none";
        // }

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
    width: 120,
    height: 30,
    backgroundColor: brand.colors.secondary,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    color: '#fff'   
  }
});

//make this component available to the app
export default MyDashboardScreen;