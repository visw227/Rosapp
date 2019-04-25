

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Keyboard
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'


import AvatarInitials from '../ReusableComponents/AvatarInitials'
import LocationButtons from '../ReusableComponents/LocationButtons';


import { dynamicSort } from '../../Helpers/DynamicSort';


import { getStaffList } from '../../Services/Site';

import SearchBar from '../ReusableComponents/SearchBar'


class StaffListScreen extends React.Component {

  static navigationOptions = (navigate) => ({

    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Staff List': navigate.navigation.state.params.title,

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.state.params.menuIconClickHandler(navigate) }
    />,

    // The drawerLabel is defined in DrawerContainer.js
    // drawerLabel: 'Staff List',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../Images/TabBar/list-simple-star-7.png')}
    //     style={[Styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
  })


  // needed a way to perform multiple actions: 1) Dismiss the keyboard, 2) Open the Drawer
  // this is passed in to navigationOptions as menuIconClickHandler
  onMenuIconClick = (navigate) => {

    navigate.navigation.toggleDrawer()
    Keyboard.dismiss()

  }



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
          data: [],
          filtered: [],
          selectedLocation: null
      }


  }


  componentDidMount () {

    let _this = this

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      menuIconClickHandler: this.onMenuIconClick, 
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    getStaffList(this.props.screenProps.state.selectedClient, userData.token, userData.location || 0, function(err, resp){


      if(err) {
        console.log("error", error)
      }
      else {
        console.log("success", resp)

        _this.props.navigation.setParams({ 
          title: "Staff List (" + resp.length + ")"
        })


        _this.setState({
          receiving: false,
          data: resp,
          filtered: resp
        })
      }

    })


  }




  getAvatar = (item) => {

    // console.log("getAvatar: ", item.name, item.userId, item.imagePath)

    // make sure that the imagePath is not null that it matches the userId
    // several were different in dev and QA and caused the image to get a 404, messing up the UI
    if(item.imagePath && item.imagePath.indexOf(item.userId) != -1) {
      return (
        <Image 
          key={new Date()} 
          style={Styles.avatar} 
          source={{uri: getHost() + "/image-server/profile-pics/" + item.userId }}
        />
      )
    }
    else {
      return (
          <AvatarInitials
            style={{alignSelf: 'center'}}
            backgroundColor={brand.colors.secondary}
            color={'white'}
            size={50}
            fontSize={20}
            text={item.name.firstAndLast}
            length={2}
          />
      )
    }
  }

  handleLocationButtonSelection = (location) => {

    console.log("location changed: ", location)



  }

  matchUsers = (query) => {

    console.log("query", query)

    let filtered = this.state.data.filter(item => item.name.firstAndLast.toLowerCase().indexOf(query.toLowerCase()) !== -1)

    this.setState({
      filtered: filtered
    })

  }


  render() {
    return (

        <View style={{ backgroundColor: '#ffffff', height: '100%' }}>





            <SearchBar
              lightTheme={true}
              color ='blue'
              value={this.state.text}
              placeholder='Search Staff List'
              onChangeText = {(text)=> { this.matchUsers(text) }}/>


            {this.state.receiving &&
              <View style={{ 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginBottom: 15,
                  marginTop: 10
              }}>
                  <ActivityIndicator size="large" color={brand.colors.primary} />
              </View>
            }

          <ScrollView style={{ backgroundColor: '#ffffff' }}>

            {!this.state.receiving &&

              <View style={{ marginTop: -20 }} >

                <List style={Styles.list}>


                  {
                    this.state.filtered.map((l, i) => (


                      <ListItem
                          key={l.employeeId}
                          roundAvatar
                          style={Styles.listItem}
                          title={l.nameOriginal}
                          titleStyle={{ color: brand.colors.gray }}
                          
                          subtitle={
                            <View style={Styles.subtitleView}>
                                {l.sharePhone &&
                                <FontAwesome name={'phone'} size={20} color={brand.colors.secondary}  style={{ paddingRight: 10 }} />
                                }
                                {l.shareEmail &&
                                <Entypo name={'email'} size={18} color={brand.colors.secondary} />
                                }
                            </View>
                          }
                          avatar={this.getAvatar(l)}
                          
                          onPress={() => this.props.navigation.navigate('Member', { member: l }) }
                      
                      />

                    ))
                  }

                </List>

              </View>
            }


          </ScrollView>
          
        </View>
    );
  }
}


//make this component available to the app
export default StaffListScreen;