

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

import moment from 'moment'

import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../../Styles/brand'
import Styles from './Styles'

import AvatarInitials from '../../ReusableComponents/AvatarInitials'

class CreateAlert extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Create an Alert',

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
        <Text 
          style={{ color: 'white', fontSize: 16 }}
          onPress={navigate.navigation.getParam('handleSubmit')} >
          Send
          </Text>
      </View>,
  })

  componentDidMount() {
    this.props.navigation.setParams({ handleSubmit: this.handleSubmit });
  }


  handleSubmit = () => {

    Alert.alert(
      'Please Confirm',
      'Are you sure that you would like to send this alert?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'Yes', onPress: () => this.sendRequest() },
      ],
      { cancelable: false }
    )


  }

  sendRequest = () => {

    console.log("submitting...")
    this.setState({
        sending: true
    })

  }

  render() {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Create an Alert</Text>
      </View>
    );

  }
}



//make this component available to the app
export default CreateAlert;