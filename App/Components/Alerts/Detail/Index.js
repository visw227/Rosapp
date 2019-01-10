

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import moment from 'moment'

import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../../Styles/brand'
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

      if(item.pushNeeded)
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



  render() {

    const { navigation } = this.props;
    const request = navigation.getParam('request', {} );


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


                <Text style={Styles.title}>"{request.title}"</Text>


                <Text style={Styles.info}>"{request.pushText || request.emailText}"</Text>
      
              

            </View>

          </View>

        </ScrollView>

      </View>

    );
  }
}



//make this component available to the app
export default ViewNotificationDetail;