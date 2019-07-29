

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  WebView
} from 'react-native';

import moment from 'moment'

import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import appConfig from '../../../../App/app-config.json'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../../Styles/brand'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import Styles from './Styles'

import AvatarInitials from '../../ReusableComponents/AvatarInitials'


class ViewNotificationDetail extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Alert Details',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


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
          userToken: '',
          userProfile: null,
          data: []
      }


  }

  getAvatar = (item) => {

      if(item)
        return (
          <View
              style={{
                alignSelf: 'center',
                  marginTop: -75, 
                  borderWidth:1,
                  borderColor: brand.colors.white,
                  alignItems:'center',
                  justifyContent:'center',
                  width:150,
                  height:150,
                  backgroundColor: brand.colors.secondary,
                  borderRadius:100,
                  marginRight: 0
                }}
            >
              <FontAwesome name={'bell'} size={60} color={brand.colors.white} />
            </View>
        )
      else  {
        return (
          <View
              style={{
                alignSelf: 'center',
                  marginTop: -75, 
                  borderWidth:1,
                  borderColor: brand.colors.white,
                  alignItems:'center',
                  justifyContent:'center',
                  width:150,
                  height:150,
                  backgroundColor: brand.colors.secondary,
                  borderRadius:100,
                  marginRight: 0
                }}
            >
              <Entypo name={'email'} size={60} color={brand.colors.white} />
            </View>
        )
      }


  }

  renderWhat = () => {

    const hideSiteNav = `
    // alert('hello')
    let x = document.getElementsByTagName('nav')
    if(x.length > 0) {
      x[0].style.display = "none";
    }
  `;
    const { navigation } = this.props;
    let env = appConfig.DOMAIN
    const request = navigation.getParam('request', {} );
    console.log('AlertDetails :request',request)
    url = "https://" + this.props.screenProps.state.selectedClient + "."+ env  + '/Scheduling/StafflinqShiftApprovals?isApp=true' 
    userData = this.props.screenProps.state.userData

    let source = {
      uri: url,
      headers: {
        "managerAppToken":  userData.token
      }
    }

    if (request.Title.indexOf('Pickup') !== -1 || request.Title.indexOf('Swap') !== -1){
      
      return (
      
        <View style={{ backgroundColor: '#ffffff', height: '100%' }}>
  
                <WebView
                  ref={'webview'}
                  source={source}
  
                  startInLoadingState = {true}
           
                  renderLoading={this.showLoadingIndicator}
                  injectedJavaScript = { hideSiteNav } 
                  style={{ flex: 1 }}
                  onNavigationStateChange={this.onNavigationStateChange}
                />

  
  
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
  

    } 
    else {
      
      return (


        <View style={Styles.container}>
  
            <ScrollView>
  
            <View style={Styles.header}></View>
  
            {this.getAvatar(request)}
            <View style={Styles.body}>
              <View style={Styles.bodyContent}>
  
                  <Text style={Styles.info}>
                    {moment(request.insertDate).format('dddd, MMM Do')} @ 
                      {moment(request.insertDate).format('h:mm A')}
                  </Text>
  
  
                  {request.Title ? <Text style={Styles.title}>"{(request.Title).toUpperCase()}"</Text> : null}
  
  
                  <Text style={Styles.info}>"{request.PushText}"</Text>
        
                
  
              </View>
  
            </View>
  
          </ScrollView>
  
        </View>
  
      );
    }     
  }



  render() {

    return (
      this.renderWhat ()
    )
   
  
  }
}



//make this component available to the app
export default ViewNotificationDetail;