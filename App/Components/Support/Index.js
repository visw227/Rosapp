import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'

export class About extends React.Component {



    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Support',

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

      }


  }

  componentDidMount () {
    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
        title: this.props.screenProps.state.selectedClient,
        backgroundColor:this.props.screenProps.state.backgroundColor 
    })

  }
    

  render() {
        return (

            <View style={Styles.container}>

              <List style={Styles.list}>


                  <ListItem

                      style={Styles.listItem}
                      title='My Requests'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>View Support Requests and Statuses</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'support', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('SupportView') }
                  
                  />
                  
                  <ListItem
                      roundAvatar
                      style={Styles.listItem}
                      title='Report an Issue'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Create a New Support Request</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'support', type: 'font-awesome' }}/>}

                      onPress={() => this.props.navigation.navigate('SupportRequest') }

                  />

                  <ListItem
                      roundAvatar
                      style={Styles.listItem}
                      title='Contact Rosnet'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Call or Email Rosnet</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'email', type: 'entypo' }}/>}

                      onPress={() => this.props.navigation.navigate('Contact') }

                  />


                  <ListItem

                      style={Styles.listItem}
                      title='App & Device Info'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Info for this app on your device</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'info', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('Device') }
                  
                  />
                  
                  <ListItem
                      roundAvatar
                      style={Styles.listItem}
                      title='Terms & Conditions'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Terms and conditions for using this app</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'list-ol', type: 'font-awesome' }}/>}

                      onPress={() => this.props.navigation.navigate('Terms') }

                  />

                  <ListItem

                      style={Styles.listItem}
                      title='Privacy Policy'
                          titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>How we protect your privacy</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'user-secret', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('Privacy') }
                  
                  />

                  <ListItem

                      style={Styles.listItem}
                      title='Logged Events'
                          titleStyle={{ color: brand.colors.gray }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Logged events that we use for debugging</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'list-alt', type: 'font-awesome'}}/>}
                      
                      onPress={() => this.props.navigation.navigate('LoggedEvents') }
                  
                  />


              </List>

            </View>
        )
  }
}

//make this component available to the app
export default About;