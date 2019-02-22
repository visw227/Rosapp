

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'


import AvatarInitials from '../ReusableComponents/AvatarInitials'
import LocationButtons from '../ReusableComponents/LocationButtons';

let fakedData = require('../../Fixtures/StaffList')
let fakedUserProfile = require('../../Fixtures/UserProfile')

import { parseName, parsePhone } from '../../Helpers/Parser';
import { dynamicSort } from '../../Helpers/DynamicSort';


class StaffListScreen extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'StaffLinQ Employees',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.toggleDrawer() }
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

    constructor(props) {
      super(props);

      // faked data repackaging and sorting
      fakedData.forEach(function(item){

        item.name = parseName(item.name)
        item.phone = parsePhone(item.phone)
        item.sortKey = item.name.firstAndLast

      })
      fakedData.sort(dynamicSort('sortKey', 1)) 


      this.state = {
          sending: false,
          receiving: false,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userToken: '',
          userProfile: fakedUserProfile,
          data: fakedData,
          selectedLocation: null
      }


  }


  componentDidMount () {

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ title: userData.selectedSite,backgroundColor:this.props.screenProps.state.backgroundColor })


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


  render() {
    return (

        <View style={{ backgroundColor: '#ffffff', height: '100%' }}>

          {this.state.userProfile && this.state.userProfile.locations && this.state.userProfile.locations.length > 1 &&
          <View style={{ backgroundColor: '#ffffff' }}>
              {/* // If there are more than 3 locations, you can reduce the font size below... */}
              <LocationButtons 
                  includeAll={false}
                  fontSize={14}
                  locations={this.state.userProfile.locations} 
                  onSelection={this.handleLocationButtonSelection}/>
          </View>

          }

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




            {!this.state.receiving &&

              <View style={{ marginTop: -20 }} >

                <List style={Styles.list}>


                  {
                    this.state.data.map((l, i) => (


                      <ListItem
                          key={l.userId}
                          roundAvatar
                          style={Styles.listItem}
                          title={l.name.firstAndLast}
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