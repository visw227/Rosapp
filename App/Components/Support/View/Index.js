import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from './Styles'


class SupportView extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'My Requests',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })


  render() {

    return (

            <View style={Styles.container}>
              <Text>My Requests
              </Text>
            </View>
    );

  }
  
}



//make this component available to the app
export default SupportView;