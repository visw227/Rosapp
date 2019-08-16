

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
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../../Styles/brand'
import SimpleLineIcon from 'react-native-vector-icons/SimpleLineIcons'
import Styles from './Styles'

import AvatarInitials from '../../ReusableComponents/AvatarInitials'


class TaskListDetail extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: navigate.navigation.getParam('type') ?  navigate.navigation.getParam('type')+' Tasklist' : 'Tasklist Detail',

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

  

 



  render() {

    const hideSiteNav = `
    let x = document.getElementsByTagName('nav')
    if(x.length > 0) {
      x[0].style.display = "none";
    }

    let y = document.getElementsByTagName('small')
    if(y.length > 0) {
      y[0].style.display = "none";
    }


    let textMuted = document.getElementsByClassName('text-muted')
    if(textMuted.length > 0) {
      
      textMuted[0].style.display = "none";
    }


    let usersPanel = document.getElementsByClassName('panel panel-primary panel-condensed')
    if(usersPanel.length > 0) {
      usersPanel[0].style.width = '80px';

    }
  `;



    const { navigation } = this.props;
    let env = this.props.screenProps.state.config.DOMAIN

    const source = navigation.getParam('source', {} );




    return (
      
      
        <View style={{ backgroundColor: '#ffffff', height: '100%' }}>
  
                <WebView
                  ref={'webview'}
                  source={source}
  
                  startInLoadingState = {true}
                
                  renderLoading={this.showLoadingIndicator}
                  injectedJavaScript = {hideSiteNav}
                  
                  style={{ flex: 1 }}
                  onNavigationStateChange={this.onNavigationStateChange}
                />
                </View>
    )
   
  
  }
}



//make this component available to the app
export default TaskListDetail;