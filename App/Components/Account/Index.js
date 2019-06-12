import React from 'react'
import { StyleSheet, Text, View, Platform } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { NavigationActions, StackActions } from 'react-navigation'


import brand from '../../Styles/brand'
import Styles from './Styles'
// import { changePasswordAccess } from '../../Services/Account';


export class Account extends React.Component {



    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Account',

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

    // headerRight : 
    //   <View style={{
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     height: 40,
    //     paddingRight: 10,
    //     width: '100%'
    //   }}>
    //     <FontAwesome
    //         name="pencil-square-o"
    //         size={30}
    //         color={brand.colors.white}
    //         style={{ paddingRight: 10 }}
    //         onPress={() => navigate.navigation.navigate('EditAvailability') }
    //     />
    //   </View>,

    // The drawerLabel is defined in DrawerContainer.js
    // drawerLabel: 'Availability',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../Images/TabBar/calendar-7.png')}
    //     style={[Styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
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
          color :  this.props.navigation.getParam('backgroundColor')

      }


  }

  componentDidMount () {

    this.props.navigation.setParams({ 
         backgroundColor:this.props.screenProps.state.backgroundColor 
    })
 
  }
    

  render() {

    const { params } = this.props.navigation.state;

        return (

            <View style={Styles.container}>
              <List style={Styles.list}>

                   <ListItem

                      style={Styles.listItem}
                      title='Profile'
                      titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Your profile information</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'user', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('Profile') }
                  
                  /> 
                  
                  <ListItem
                      roundAvatar
                      style={Styles.listItem}
                      title='Settings'
                      titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Various settings for this app</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'gear', type: 'font-awesome' }}/>}

                      onPress={() => {
                        const navigateAction = NavigationActions.navigate({
                            routeName: 'Settings',
                          
                            params: {},
                          
                            action: NavigationActions.navigate({ routeName: 'Settings' }),
                          });
                           this.props.navigation.dispatch(navigateAction)
                      } }

                  />

                {this.props.screenProps.state.userData.canChangePassword &&  
                  
                  <ListItem
                      style={Styles.listItem}
                      title='Change Password'
                      titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Change your account password</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'lock', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('Password') }
                  
                  />

                  
                } 
                {Platform.OS === 'android' &&   <ListItem
                      style={Styles.listItem}
                      title='Change Passcode'
                      titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Change your app passcode</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'key', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('PinCode',{change : 'true'}) }
                  
                  />}

              </List>

            </View>
        )
  }
}



//make this component available to the app
export default Account;