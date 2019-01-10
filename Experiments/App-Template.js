import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'


import brand from '../App/Styles/brand'

// hide warnings for now...
console.disableYellowBox = true;

class HomeScreen extends React.Component {


  static navigationOptions = (navigate) => ({

    title: 'Home Screen',

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

    drawerLabel: 'Home',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../App/Images/TabBar/calendar-7.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  })

  render() {
    return (

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home</Text>
      </View>

    )
  }
}

class NotificationsScreen extends React.Component {




  static navigationOptions = (navigate) => ({

    title: 'Notifications',

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

    drawerLabel: 'Notifications',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../App/Images/TabBar/clock-alarm-7.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  })



  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Notifications</Text>
      </View>
    );
  }
}


class Screen1 extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'Screen 1',

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

    drawerLabel: 'Screen 1',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../App/Images/TabBar/clock-alarm-7.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),

  })

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen 1</Text>
      </View>
    )
  }
}

class Screen2 extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'Screen 2',

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

    drawerLabel: 'Screen 2',
    drawerIcon: ({ tintColor }) => (
      <Image
        source={require('../App/Images/TabBar/clock-alarm-7.png')}
        style={[styles.icon, {tintColor: tintColor}]}
      />
    ),
  })

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Screen 2</Text>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});

// NOTE: These individual screens had to be in their own stack in order for their title
// to appear - react-navigation v2 is squirrelly
let Screen1Stack = createStackNavigator({ Screen1 })
let Screen2Stack = createStackNavigator({ Screen2 })
let HomeScreenStack = createStackNavigator({ HomeScreen })
let NotificationsScreenStack = createStackNavigator({ NotificationsScreen })


let TabStack = createBottomTabNavigator({

  Home: {
    screen: HomeScreenStack, // MUST use a stack here or the title will not appear
    navigationOptions: ({ navigation }) => ({

        // title and headerTitle DO NOT WORK HERE
        // the title must be set in the screen
        // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
        tabBarLabel: 'Home',
        //tabBarIcon: () => <FontAwesome name="calendar-o" size={30} color={brand.colors.primary} />
        tabBarIcon: ({ tintColor }) =>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../App/Images/TabBar/calendar-7.png')} />
          </View>

    })

  },


  Notifications: {
    screen: NotificationsScreenStack, // MUST use a stack here or the title will not appear
    navigationOptions: ({ navigation }) => ({

        // title and headerTitle DO NOT WORK HERE
        // the title must be set in the screen
        // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
        tabBarLabel: 'Notifications',
        //tabBarIcon: () => <FontAwesome name="bell-o" size={30} color={brand.colors.primary} />
        tabBarIcon: ({ tintColor }) =>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../App/Images/TabBar/clock-alarm-7.png')} />
          </View>

    })
  },





}, {

    tabBarOptions: {
      activeTintColor: brand.colors.primary, // not really being used with our images
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#ffffff',
      },
      showIcon: true,
      showLabel: false
    },
  
})


const DrawerStack = createDrawerNavigator({
  Tabs: { 
    screen: TabStack,
    navigationOptions: ({ navigation }) => ({

      // this drawer lable for the stack MUST be defined here for some 
      // react-navigation v2 squirrelly reason
      drawerLabel: 'My Home',
      drawerIcon: ({ tintColor }) => (
        <Image
          source={require('../App/Images/TabBar/clock-alarm-7.png')}
          style={[styles.icon, {tintColor: tintColor}]}
        />
      ),

    }),

  },
  Screen1: {
    screen: Screen1Stack,
  },
  Screen2: {
    screen: Screen2Stack,
  },
});

export default DrawerStack
