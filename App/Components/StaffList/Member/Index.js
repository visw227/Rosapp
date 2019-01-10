import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import StaffMemberScreen from '../../ReusableComponents/StaffMember'

import brand from '../../../Styles/brand'

class Member extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Staff Member',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })


  render() {

    const { navigation } = this.props;
    const member = navigation.getParam('member', {} );


    return (

        <StaffMemberScreen member={member} />

    )
  }
}



//make this component available to the app
export default Member;