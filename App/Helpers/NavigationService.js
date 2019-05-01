// Used by 
//  - App-Rosnet.js
//  - /Helpers/ServiceWrapper.js
// this is needed since props.navigation isn't present for unmounted screen components

import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

function stackReset(routeName) {

  // instead, reset the navigation - otherwise user will see back arrow in some case or can swipe back
  _navigator.dispatch(
    StackActions.reset({
        index: 0,
        key: null, // this is the trick that allows this to work
        actions: [NavigationActions.navigate({ routeName: routeName })],
    })
  )

}


// add other navigation functions that you need and export them

export default {
  navigate,
  stackReset,
  setTopLevelNavigator,
};