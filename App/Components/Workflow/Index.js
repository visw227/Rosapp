import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../../Styles/brand'
import Styles from './Styles'


export class Workflow extends React.Component {

    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Workflow',

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


    // The drawerLabel is defined in DrawerContainer.js
    // drawerLabel: 'Availability',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../Images/TabBar/calendar-7.png')}
    //     style={[Styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
  })



  render() {
    return (
      <View style={Styles.container}>
        <Text>Workflow
        </Text>
      </View>
    )
  }
}


//make this component available to the app
export default Workflow;