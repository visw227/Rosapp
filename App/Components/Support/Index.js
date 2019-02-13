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
    headerStyle: {backgroundColor: brand.colors.primary },
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
                      title='Contact Information'
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Call or Email Rosnet</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'support', type: 'font-awesome' }}/>}

                      onPress={() => this.props.navigation.navigate('Contact') }

                  />



              </List>

            </View>
        )
  }
}

//make this component available to the app
export default About;