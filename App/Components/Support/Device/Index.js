import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  AsyncStorage
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from '../Styles'

import DeviceInfo from 'react-native-device-info'


class Device extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'App & Device Info',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

  constructor(props) {
    super(props);

    
    let deviceId = DeviceInfo.getUniqueID()
    let version = DeviceInfo.getVersion()
    let build = DeviceInfo.getBuildNumber()

    this.state = {
        appCenterInstallId: '',
        deviceId: deviceId,
        version: version,
        build: build
    }

  }


  componentDidMount() {


    AsyncStorage.getItem('AppCenterInstallId').then((data) => {
        this.setState({
            appCenterInstallId: data
        })
    })

  }



  render() {

    return (
            <View style={Styles.container}>

              <List style={Styles.list}>


                  <ListItem

                      hideChevron={true}
                      style={Styles.listItem}
                      title='App Version & Build'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.subtitleText}>{this.state.version} ({this.state.build})</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'info', type: 'font-awesome'}}/>}
                      

                  
                  />
                  
                  <ListItem

                      hideChevron={true}
                      style={Styles.listItem}
                      title='App Installation ID'
                          titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.subtitleText}>{this.state.appCenterInstallId}</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'info', type: 'font-awesome'}}/>}
                  
                  />

                  
                  <ListItem

                      hideChevron={true}
                      style={Styles.listItem}
                      title='Device ID'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.subtitleText}>{this.state.deviceId}</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'info', type: 'font-awesome'}}/>}



                  />





              </List>

            </View>
    );

  }
  
}



//make this component available to the app
export default Device;