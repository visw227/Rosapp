import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  SectionList
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../App/Styles/brand'

// import Styles from './Styles'

import { List, ListItem, Avatar } from 'react-native-elements'

import AvatarInitials from '../App/Components/ReusableComponents/AvatarInitials_v2'

// hide warnings for now...
console.disableYellowBox = true;



class Test extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Settings',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

    constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userToken: '',
          userProfile: null
      }


  }


  


  render() {


    return (
            <ScrollView
                style={{ backgroundColor: '#ffffff' }}
                refreshControl={

                <RefreshControl
                    refreshing={this.state.receiving}
                    onRefresh={this.loadData}
                    tintColor={brand.colors.primary}
                    title="Loading"
                    titleColor={brand.colors.primary}
                    //colors={['#ff0000', '#00ff00', '#0000ff']}
                    progressBackgroundColor="#ffffff"
                />
                }
                
              >


        <AvatarInitials
            style={{alignSelf: 'center'}}
            backgroundColor={brand.colors.secondary}
            color={'white'}
            size={50}
            fontSize={20}
            text={'John Smith'}
            length={2}
          />

        <AvatarInitials
            style={{alignSelf: 'center'}}
            backgroundColor={brand.colors.secondary}
            size={100}
            imageUserId={547}
            imageStyle={{ 
                marginLeft: 2,
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 0.9,
                borderColor: 'white',
            }}
          />

        <AvatarInitials
            imageUserId={555}
            imageStyle={{ 
                marginLeft: 2,
                width: 130,
                height: 130,
                borderRadius: 65,
                borderWidth: 3,
                borderColor: brand.colors.secondary,
                backgroundColor: brand.colors.secondary,
            }}
          />

            </ScrollView>
    );
  }
}


const Styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor: brand.colors.secondary,
    color: brand.colors.white,
    fontStyle: 'italic'
  },
  container: {
    // flex: 1,
    // backgroundColor: 'white',
    // paddingTop: 0,
    // marginTop: 0
  },
  list: {
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: 'white',
  },
});


//make this component available to the app
export default Test;