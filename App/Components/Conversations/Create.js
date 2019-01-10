import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../Styles/brand'
import Styles from './Styles'



class CreateConversation extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Create a Chat Conversation',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })


  render() {


    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Create a new chat conversation</Text>
      </View>
    );
  }
}


//make this component available to the app
export default CreateConversation;