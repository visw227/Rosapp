import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  AsyncStorage,
  TextInput
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from './Styles'

import { getUserProfile } from '../../../Services/Account'

import AvatarInitials from '../../ReusableComponents/AvatarInitials'

import { List, ListItem, Avatar } from 'react-native-elements'

let fakedUserProfile = require('../../../Fixtures/UserProfile')

class Profile extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Profile',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',

        headerRight : 
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 10,
        width: '100%'
      }}>
        <Text 
          style={{ color: 'white', fontSize: 16 }}
          onPress={navigate.navigation.getParam('handleSubmit')} >
          Submit
          </Text>
      </View>,


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
        userProfile: fakedUserProfile,
        email: '',
        phone: '',
        shareEmail: false,
        sharePhone: false
    }


  }

  componentWillMount () {

      let _this = this 

      // no need for shared state here. Just get the token from local storage
      // AsyncStorage.getItem('userToken', function(err, token){

      //   // make sure state is updated before making API calls
      //   _this.setState({
      //     userToken: token
      //   }, () => _this.loadData() );


      // })

  }

  loadData = () => {

    console.log("getting user profile...")

    // this takes on a different scope inside the callbacks below
    let _this = this
    _this.setState({receiving: true});

    getUserProfile(_this.state.userToken, function(err, profile){

      if(err) {
        console.log("getUserProfile error", err)
      }
      else {

        console.log("getUserProfile success", profile)

        //console.log("getting schedules...")
        
        _this.setState({ 
          receiving: false, 
          userProfile: profile,
          email: profile.email,
          phone: profile.phone,
          shareEmail: profile.shareEmail,
          sharePhone: profile.sharePhone
        });

      }

    })

  }



  getAvatar = (item) => {

    // item.photo = 'https://rosqa.stafflinq.com/image-server/profile-pics/13367'

    // console.log("getAvatar: ", item.name, item.userId, item.imagePath)

    // make sure that the imagePath is not null that it matches the userId
    // several were different in dev and QA and caused the image to get a 404, messing up the UI
    if(item.photo && item.photo.length > 0) {
      return (

        <Image 
          key={new Date()} 
          style={Styles.avatar} 
          source={{uri: item.photo }}
        />
    
      )
    }
    else {
      return (
          <AvatarInitials
            style={{alignSelf: 'center', marginTop: -55, borderColor: '#ffffff', borderWidth: 1 }}
            backgroundColor={brand.colors.secondary}
            color={'white'}
            size={100}
            fontSize={30}
            text={item.name.firstAndLast}
            length={2}
          />
      )
    }
  }


  render() {

    const member = this.state.userProfile


    return (


      
            <View style={Styles.container}>
              <Text>Profile
              </Text>
            </View>


    );
  }
}


//make this component available to the app
export default Profile;