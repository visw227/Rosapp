

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


import appConfig from '../../app-config.json'


import LocationButtons from '../ReusableComponents/LocationButtons'


let fakedUserProfile = require('../../Fixtures/UserProfile')



class DashboardScreen extends React.Component {

  static navigationOptions = (navigate) => ({

     title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Dashboard': navigate.navigation.state.params.title,

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

    headerRight : 
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 10,
        width: '100%'
      }}>

        <FontAwesome
            name="window-restore"
            size={20}
            color={brand.colors.white}
            style={{ marginRight: 10 }}
            onPress={ navigate.navigation.getParam('toggleClientModal') }
        />

      </View>,

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

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ title: userData.sites[0] })


    let selectedSite = this.props.screenProps.state.selectedSite
    let clientCode = userData.sites[0].toLowerCase()
    let env = appConfig.WEB_HOST // rosnetdev.com, rosnetqa.com, rosnet.com



    let source = {
      uri: "https://" + clientCode + "." + env + "/WebFocus/Dashboard/847C5BE8-3B46-497D-B819-E8F78738A13B",
      headers: {
        "managerAppToken":  userData.token,
        "Cookie": "rememberme=" + userData.userName + "; clientCode=" + selectedSite + "; rosnetToken=" + userData.token 
      }
    }


    console.log("Dashboard source", JSON.stringify(source, null, 2))


    _this.setState({
      userData: userData,
      source: source
    })


    // associate the handler
    this.props.navigation.setParams({ toggleClientModal: this.toggleClientModal })
    
  }

 

  onSelectedSite = (value) => {

    console.log("changed site", value)

    let selectedSite = value.toLowerCase()

    // this shares the persisted userData to the App-Rosnet.js wrapper
    this.props.screenProps._globalStateChange( { source: "Dashboard", selectedSite: selectedSite })

    let userData = this.props.screenProps.state.userData


    let env = appConfig.WEB_HOST // rosnetdev.com, rosnetqa.com, rosnet.com

    let source = {
      uri: "https://" + selectedSite + "." + env + "/WebFocus/Dashboard/847C5BE8-3B46-497D-B819-E8F78738A13B",
      headers: {
        "managerAppToken": this.props.screenProps.state.userData.token,
        "Cookie": "rememberme=" + userData.userName + "; clientCode=" + selectedSite + "; rosnetToken=" + userData.token 
      }
    }

    console.log("source", JSON.stringify(source, null, 2))

    this.props.navigation.setParams({ title: value })

    this.setState({
      selectedSite: value,
      source: source
    })
  
  }

 
  _renderLoading = () => {
    return (
     
      <Progress.Bar progress={0.4} width={700} />
  
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
                startInLoadingState = {true}
                onLoadProgress={e => console.log(e.nativeEvent.progress)}
                renderLoading={this._renderLoading}
                injectedJavaScript={ hideSiteNav }
                style={{ flex: 1 }}
              />
            }

            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.showClientModal}
              onRequestClose={() => {
                this.setState({ showClientModal: false })
              }}>
              <View style={{ flex: 1,
                  marginTop: 40,
                  paddingLeft: 40,
                  paddingRight: 40,
                  justifyContent: 'space-around',
                  backgroundColor: brand.colors.white
              }}>
          
                  <View style={{ alignItems: 'center'}}>
                    <Text style={{ fontSize: 20, color: brand.colors.primary }}>Select a Site</Text>
                  </View>

                  <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: brand.colors.primary }}>To select a different Rosnet site, scroll to one of the sites listed below and press 'Continue'.</Text>
                  </View>


                  <View style={{ alignItems: 'center', marginBottom: 100 }}>
                    <Picker
                        selectedValue={this.state.selectedSite}
                        style={{ height: 40, width: '90%' }}
                        itemStyle={{
                            fontSize: 25,
                        }}
                        onValueChange={(itemValue, itemIndex) => this.setState({
                          selectedSite : itemValue
                        })}>
                        {this.state.userData && this.state.userData.sites && this.state.userData.sites.map(item => (
                            <Picker.Item 
                                key={item}
                                label={item} value={item} 
                            />
                        ))}
                    </Picker>
                  </View>


                  <View style={{ alignItems: 'center', marginBottom: 100 }}>

                    <TouchableOpacity                 
                      onPress={() => {
                        this.onSelectedSite (this.state.selectedSite)
                        this.setState({ showClientModal: false }) ;
                      }} style={styles.button}>
                      <Text style={styles.buttonText}>
                        Continue
                      </Text>
                    </TouchableOpacity>

                  </View>

              </View>
            </Modal>


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
  }
});

//make this component available to the app
export default DashboardScreen;