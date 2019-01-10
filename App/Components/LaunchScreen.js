
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Image
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import brand from '../Styles/brand'

class LaunchScreen extends React.Component {

    // MUST BE PRESENT or NO title will appear
  static navigationOptions = {
    header: null


  }

  constructor(props) {
    super(props);

  }


  componentDidMount() {


      let _this = this


      // get all stored keys
      AsyncStorage.getAllKeys((err, keys) => {

        AsyncStorage.multiGet(keys, (err, stores) => {


          let userData = null
          let selectedSite = ''
          let menuItems = null

          stores.map((result, i, store) => {

            // get at each store's key/value so you can work with it
            let key = store[i][0];
            let value = store[i][1];

            if(key === 'userData') {
              userData = JSON.parse(value)
            }
            else if(key === 'selectedSite') {
              selectedSite = value
            }
            else if(key === 'menuItems') {
              menuItems = JSON.parse(value)
            }

          });

          // if userData is null, all other keys are invalid since the user is not logged in
          if(userData) {

            // this shares the persisted state objects to the App-Rosnet.js wrapper
            _this.props.screenProps._globalStateChange( { source: "Launch", userData: userData, selectedSite: selectedSite, menuItems: menuItems } )

          }

          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          //this.props.navigation.navigate(userToken ? 'DrawerStack' : 'LoginStack');
          let routeName = userData ? 'DrawerStack' : 'LoginStack'
          // instead, reset the navigation
          const resetAction = StackActions.reset({
              index: 0,
              key: null, // this is the trick that allows this to work
              actions: [NavigationActions.navigate({ routeName: routeName })],
          });
          this.props.navigation.dispatch(resetAction);



        });
      });



  }


  // Render any loading content that you like here
  render() {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('../Images/ajax-loader.gif')} />
        <StatusBar barStyle="default" />
      </View>
    );

  }
}


//make this component available to the app
export default LaunchScreen;
