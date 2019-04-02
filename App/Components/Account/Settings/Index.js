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

import brand from '../../../Styles/brand'

import Styles from './Styles'

import { List, ListItem, Avatar } from 'react-native-elements'


let options = [
  {
    group: "Messages",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Available Shifts",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Shift Wanted",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Work Calendar",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  }
]

class Settings extends React.Component {

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


  componentDidMount () {
    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

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

                <SectionList
                    renderItem={({item, index, section}) => 
                        <ListItem

                            key={item.type + index}
                            style={{ padding:0, marginTop:-10 }}
                            switchButton
                            switched={this.state.showAvailableShifts}
                            hideChevron
                            title={item.type}
                            onSwitch={this.toggleShowAvailableShifts}

                        />
                    }
                    renderSectionHeader={({section: {group}}) => (
                        <Text style={Styles.sectionHeader}>{group}</Text>
                    )}
                    sections={options}
                    keyExtractor={(item, index) => item.type + index}
                />

            </ScrollView>


    );
  }
}


//make this component available to the app
export default Settings;