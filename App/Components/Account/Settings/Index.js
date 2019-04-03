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
import { alertTypes } from '../../../Services/Push';


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
          userProfile: null,
          alertOptions : [],
          options : []
      }

  }


  componentDidMount () {
    _this = this

    var list = {}
    var optionsman = []

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    var client = this.props.screenProps.state.userData.selectedSite
    var token = this.props.screenProps.state.userData.token


    alertTypes (client,token ,function(err,resp) {
      if (err){
        console.log ('Error siteSettings',err)
      }
      else {
        console.log('response',resp)
        var alertTypes = []

          resp.forEach(element => {
            if(element.alert_category.toLowerCase() === 'stafflinq'){
              alertTypes.push(element.alert_name)
            }
          });
          console.log('modifiedresp',alertTypes)

          _this.setState ({
            alertOptions : alertTypes
          }, ()=> console.log('AlertState',_this.state.alertOptions))

        
      }

      })

      

  }


  render() {
    var optionsList = []
     if(this.state.alertOptions.length > 0) {

      for (i=0; i < this.state.alertOptions.length ; i++ ) {
        
        opts = Object.assign(
         {},{  group:this.state.alertOptions[i] ,
         data: [
           // {
           //   type: "Email Notification",
           //   selected: true
           // },
           {
             type: "Push Notification",
             selected: true
           },
         ]}
        )
        optionsList.push(opts)
       
     }
     
     console.log ('optionsRa',optionsList)
     

     }


    

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
                    sections={optionsList}
                    keyExtractor={(item, index) => item.type + index}
                />

            </ScrollView>


    );
  }
}


//make this component available to the app
export default Settings;