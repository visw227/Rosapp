import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,TouchableHighlight
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from './Styles'

import ImagePicker from 'react-native-image-picker'

var options = {
  
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

class SupportRequest extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Report an Issue',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

  constructor(props) {
    super(props)

    // improve the name display
    // From: CANDICE DOMINGUEZ FIELDS
    // To: {
    //   "first": "Candice",
    //   "last": "Dominguez",
    //   "initials": "CD",
    //   "name": "Candice Dominguez"
    // }
    //let nameObj = parseName(this.props.name)
 

    let avatarUrl = null
    // if(this.props.imageName) {
    //   options = { ...options, customButtons }
    //   avatarUrl = getHost() + '/image-server/profile-pics/' + props.userId + '?ts=' + moment.utc()
    // }

    console.log(">>>>>> avatarUrl constructor: " + avatarUrl)

    this.state = {
      // avatarSource: source.uri,
      avatarUrl: avatarUrl,
      //name: nameObj,
      options
    }
  }

  handleImage = () => {
    ImagePicker.showImagePicker(this.state.options, (response) => {
      console.log('Response = ', response);
     
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
     
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
     
        this.setState({
          avatarSource: source
        });
      }
    })
  }


  render() {

    return (

            <View style={Styles.container}>
            <TouchableHighlight onPress = {()=> this.handleImage()}>
            <Text>Report an Issue
              </Text>

            </TouchableHighlight>
              
            </View>
    );

  }
  
}


//make this component available to the app
export default SupportRequest;