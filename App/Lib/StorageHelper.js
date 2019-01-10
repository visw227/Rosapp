/*

Facebook recommends:
It is recommended that you use an abstraction on top of AsyncStorage instead of 
AsyncStorage directly for anything more than light usage since it operates globally.
https://facebook.github.io/react-native/docs/asyncstorage

*/


import { AsyncStorage } from "react-native"

//export const getStorageItem = async (key) => await AsyncStorage.getItem(key);

export const setStorageItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Error saving data
  }
}


export const getStorageItem = async(key)=> {
    return await AsyncStorage.getItem(key)
        .then((result) => {
            if (result) {
                try {
                    //result = JSON.parse(result);
                } catch (e) {
                    // console.error('AsyncStorage#getItem error deserializing JSON for key: ' + key, e.message);
                }
            }
            return result;
        });
}


export const getAllKeys = async() => {

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