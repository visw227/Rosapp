
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

import AppCenter from 'appcenter'

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

      // this will change on each installation, so always check on launch
      // this is async
      AppCenter.getInstallId().then(async (response) => {
        console.log('App Center Install Id: ', response)
        AsyncStorage.setItem('AppCenterInstallId', response)
      })


      AsyncStorage.getItem('userData').then((data) => {

        let routeName = ''

        if(data) {

          let userData = JSON.parse(data)

          // this shares the persisted state objects to the App-Rosnet.js wrapper
          _this.props.screenProps._globalStateChange( { action: "launch", userData: userData } )



          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          //this.props.navigation.navigate(userToken ? 'DrawerStack' : 'LoginStack');
          routeName = 'DrawerStack'
          // instead, reset the navigation
          const resetAction = StackActions.reset({
              index: 0,
              key: null, // this is the trick that allows this to work
              actions: [NavigationActions.navigate({ routeName: routeName })],
          });
          this.props.navigation.dispatch(resetAction);


        }
        else {

          routeName = 'LoginStack'
          // instead, reset the navigation
          const resetAction = StackActions.reset({
              index: 0,
              key: null, // this is the trick that allows this to work
              actions: [NavigationActions.navigate({ routeName: routeName })],
          });
          this.props.navigation.dispatch(resetAction);

        }


      })




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
