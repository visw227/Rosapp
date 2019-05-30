import React from 'react';
import { AppState, AsyncStorage, StyleSheet, Text, View, Image, Alert } from 'react-native';

import { createAppContainer, createStackNavigator, createDrawerNavigator, NavigationActions, StackActions } from 'react-navigation'

import { createBottomTabNavigator } from 'react-navigation-tabs'


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import brand from './Styles/brand'

import NavigationService from './Helpers/NavigationService';

import { generateRandomNumber, checkForNotifications } from './Services/Background';

import { GetNotifications,resetBadgeCount, getBadgeCount } from './Services/Push';

import { Chat } from './Helpers/Chat';

import { Authorization } from './Helpers/Authorization';
// import { Logger } from './Helpers/Logger';

import Push from 'appcenter-push'

import config from './app-config.json'

import { Biometrics } from './Helpers/Biometrics';

import firebase, { RNFirebase } from 'react-native-firebase'

import {LoginSelectClient} from './Components/Account/Login/SelectClient'

import  { Notification, NotificationOpen } from 'react-native-firebase';

import Badge from './Components/Alerts/badge'








// hide warnings for now...
console.disableYellowBox = true;


Push.setListener({
  onPushNotificationReceived: function (pushNotification) {
    let message = pushNotification.message;
    let title = pushNotification.title;

    if (message === null) {
      // Android messages received in the background don't include a message. On Android, that fact can be used to
      // check if the message was received in the background or foreground. For iOS the message is always present.
      title = 'Android background';
      message = '<empty>';
    }

    // Custom name/value pairs set in the App Center web portal are in customProperties
    if (pushNotification.customProperties && Object.keys(pushNotification.customProperties).length > 0) {
      message += '\nCustom properties:\n' + JSON.stringify(pushNotification.customProperties);
    }

    if (AppState.currentState === 'active') {
      Alert.alert(title, message);
    }
    else {
      // Sometimes the push callback is received shortly before the app is fully active in the foreground.
      // In this case you'll want to save off the notification info and wait until the app is fully shown
      // in the foreground before displaying any UI. You could use AppState.addEventListener to be notified
      // when the app is fully in the foreground.
    }
  }
});


// *******************************************************************************
// Launch and Lock screen
// *******************************************************************************

import LaunchScreen from './Components/LaunchScreen'
import LockScreen from './Components/Account/Security/LockScreen'


let LaunchStack = createStackNavigator({ 
  screen: LaunchScreen,
  navigationOptions: ({ navigation, screenProps }) => ({
      //
  })
});

let LockScreenStack = createStackNavigator({ LockScreen });
// added this to introduce screenProps into the stack
LockScreenStack.navigationOptions = ({ navigation, screenProps }) => {
  return {
    gesturesEnabled: false,
    swipeEnabled: false
  };
};


// *******************************************************************************
// Login stack
// *******************************************************************************

import LoginScreen from './Components/Account/Login/Index'
import ForgotPasswordScreen from './Components/Account/ForgotPassword/Index'
import LoginSelectClientScreen from './Components/Account/Login/SelectClient'



let LoginStack = createStackNavigator({

    Login: { 
        
        screen: LoginScreen,

        navigationOptions: ({ navigation , screenProps}) => ({
            header: null
        })
            
    },
    ForgotPassword: { 
        
        screen: ForgotPasswordScreen,

        navigationOptions: ({ navigation, screenProps }) => ({
            title: 'Forgot Password'
        })
            
        
    },
    // this was added for QA so that we could select another client when our selected one is down
    LoginSelectClient: { 
        
        screen: LoginSelectClientScreen,

        navigationOptions: ({ navigation, screenProps }) => ({
            title: 'Choose a Site'
        })
        
    },

}, {
    initialRouteName: 'Login',
    // headerMode: 'float',
    // navigationOptions: ({navigation}) => ({
    //     headerStyle: {backgroundColor: global.colors.brand.primary },
    //     headerTintColor: 'white',
    //     gesturesEnabled: false,
    // })
  
})




// *******************************************************************************
// Account
// *******************************************************************************

import AccountScreen from './Components/Account/Index'
import SettingsScreen from './Components/Account/Settings/Index'
import ProfileScreen from './Components/Account/Profile/Index'
// NOTE: This screen is shared by 2 stacks
import PasswordScreen from './Components/Account/Password/Index'
let PasswordChangeRequiredStack = createStackNavigator({ PasswordScreen });
import SecurityScreen from './Components/Account/Security/Index'

let AccountStack = createStackNavigator({ 
  Account: {
    screen: AccountScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  },
  Settings: {
    screen: SettingsScreen
  },
  Profile: {
    screen: ProfileScreen
  },
  Password: {
    screen: PasswordScreen
  },
  Security: {
    screen: SecurityScreen
  } 
});



// *******************************************************************************
// Dashboard 
// *******************************************************************************
import DashboardScreen from './Components/Dashboard/Index'

let DashboardStack = createStackNavigator({ 
  Dashboard: {
    screen: DashboardScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  }

});

// to hide the tabBar on nested screens, you must do it this way
DashboardStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


// *******************************************************************************
// Modules 
// *******************************************************************************

// import ModulesSubMenuScreen from './Components/Modules/SubMenu'
import ModulesItemsScreen from './Components/Modules/Items'
import ModulesWebViewScreen from './Components/Modules/WebView'
import ModulesSearchItemsScreen from './Components/Modules/SearchItems'

let ModulesStack = createStackNavigator({ 
  ModulesItems: {
    screen: ModulesItemsScreen
  },
  SearchItems: {
    screen: ModulesSearchItemsScreen
  },
  ModulesWebView: {
    screen: ModulesWebViewScreen
  },

});


// to hide the tabBar on nested screens, you must do it this way
ModulesStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


// *******************************************************************************
// Alerts 
// *******************************************************************************
import AlertScreen from './Components/Alerts/Index'
import AlertCreateScreen from './Components/Alerts/Create/Index'
import AlertDetailScreen from './Components/Alerts/Detail/Index'

let AlertStack = createStackNavigator({ 
  Alerts: {
    screen: AlertScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  },
  AlertDetail: {
    screen: AlertDetailScreen
  },
  AlertCreate: {
    screen: AlertCreateScreen
  },

});

// to hide the tabBar on nested screens, you must do it this way
AlertStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};

// *******************************************************************************
// Workflow 
// *******************************************************************************

import WorkflowScreen from './Components/Workflow/Index'

let WorkflowStack = createStackNavigator({ 
  Workflow: {
    screen: WorkflowScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  },


});


// to hide the tabBar on nested screens, you must do it this way
WorkflowStack.navigationOptions = ({ navigation }) => {
  return {
    tabBarVisible: navigation.state.index === 0,
  };
};


// *******************************************************************************
// Chat - Replaces Conversastions 
// *******************************************************************************

import ChatScreen from './Components/Chat/Index'
let ChatStack = createStackNavigator({ ChatScreen });


// *******************************************************************************
// Tabbed UI 
// *******************************************************************************

let TabStack = createBottomTabNavigator({

  

  Dashboard: {
    
    screen: DashboardStack,
    navigationOptions: ({ navigation, screenProps }) => ({

        // title and headerTitle DO NOT WORK HERE
        // the title must be set in the screen
        // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
        tabBarLabel: (focused) =><View>
        {focused.focused ?<View style = {{borderBottomWidth :2,borderBottomColor:brand.colors.primary}}><Text style = {{color:brand.colors.primary,fontSize:12,textAlign:'center'}}>Dashboards</Text></View> :
     <Text style = {{color:brand.colors.gray,fontSize:12,textAlign:"center"}}>Dashboards</Text>
     } 
   </View>,
        tabBarIcon: (focused) =><View>
           {focused.focused ?<View><FontAwesome name="tachometer" size={20} color={brand.colors.primary}/></View> :
        <FontAwesome name="tachometer" size={20} color={brand.colors.gray} />
        } 
      </View>

    })

  },


  // Workflow: {
  //   screen: WorkflowStack,
  //   navigationOptions: ({ navigation, screenProps }) => ({

  //       // title and headerTitle DO NOT WORK HERE
  //       // the title must be set in the screen
  //       // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
  //       tabBarLabel: 'Workflow',
  //       tabBarIcon: () => <Entypo name="flow-branch" size={20} color={brand.colors.primary} />
  //       // tabBarIcon: () => <MaterialCommunityIcon name="clipboard-flow" size={20} color={brand.colors.primary} />
  //       // tabBarIcon: ({ tintColor }) =>
  //       //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       //     <Image source={require('./Images/TabBar/list-simple-star-7.png')} />
  //       //   </View>

  //   })
  // },


  Conversations: {
    screen: ChatStack,
    navigationOptions: ({ navigation, screenProps }) => ({

        // title and headerTitle DO NOT WORK HERE
        // the title must be set in the screen
        // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
        tabBarLabel: (focused) =><View>
        {focused.focused ?<View style = {{borderBottomWidth :2,borderBottomColor:brand.colors.primary}}><Text style = {{color:brand.colors.primary,fontSize:12,textAlign:'center'}}>Chat</Text></View> :
     <Text style = {{color:brand.colors.gray,fontSize:12,textAlign:'center'}}>Chat</Text>
     } 
   </View>,
        // tabBarIcon: () => <FontAwesome name="tachometer" size={20} color={brand.colors.primary} />
        tabBarIcon: (focused) => 
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {focused.focused ?<View><Ionicon name="ios-chatbubbles" size={20} color={brand.colors.primary}/></View>
:             <Ionicon name="ios-chatbubbles" size={20} color={brand.colors.gray} />
}
            {screenProps.state.messageCount > 0 &&
            <View style={{ 
                position: 'absolute', 
                paddingLeft: 4, 
                paddingRight: 4,
                right: -20, 
                top: 1, 
                backgroundColor: brand.colors.orange, 
                borderRadius: 10, 
                height: 20, 
                //width: 20, // DONT set this - let it by dynamic - use minWidth to keep it round if just 1 digit
                minWidth: 20, // this keeps it round with borderRadius=10
                justifyContent: 'center', 
                alignItems: 'center' }}>
              <Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>{screenProps.state.messageCount}</Text>
            </View>
            }
     

          </View>

    })

  },

  Alerts: {
    screen: AlertStack,
    navigationOptions: ({ navigation, screenProps }) => ({

        // title and headerTitle DO NOT WORK HERE
        // the title must be set in the screen
        // tabBarLabel and tabBarIcon MUST BE SET HERE inside of createBottomTabNavigator
        tabBarLabel: (focused) =><View>
        {focused.focused ?<View style = {{borderBottomWidth :2,borderBottomColor:brand.colors.primary}}><Text style = {{color:brand.colors.primary,fontSize:12,textAlign:'center'}}>Alerts</Text></View> :
     <Text style = {{color:brand.colors.gray,fontSize:12,textAlign:'center'}}>Alerts</Text>
     } 
   </View>,
        
        tabBarIcon: (focused) => <View>

{
          focused.focused ?<View><Badge screenProps = {screenProps} navigation = {navigation} color = {brand.colors.primary}/></View>:
          <Badge screenProps = {screenProps} navigation = {navigation} color = {brand.colors.gray}/>
        } 

        </View> 

    })
  },



}, {
  
    //initialRouteName: 'TimeOff',
    
    tabBarOptions: {
      activeTintColor: brand.colors.primary, // not really being used with our images
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: '#ffffff',
        paddingTop: 5,
      },
     
      showIcon: true,
      showLabel: true
    },
    
  
})

// added this to introduce screenProps into the stack
TabStack.navigationOptions = ({ navigation, screenProps }) => {
  return {
  };
};



// *******************************************************************************
// Staff List
// *******************************************************************************
import StaffListScreen from './Components/StaffList/Index'
import StaffListMemberScreen from './Components/StaffList/Member/Index'

let StaffListStack = createStackNavigator({ 
  StaffList: {
    screen: StaffListScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  },
  Member: {
    screen: StaffListMemberScreen
  },

});



// *******************************************************************************
// Support
// *******************************************************************************

import SupportScreen from './Components/Support/Index'

import SupportListScreen from './Components/Support/List/Index'
import SupportRequestScreen from './Components/Support/Request/Index'
import SupportRequestDetailScreen from './Components/Support/List/Detail'

import SupportRegisterUserScreen from './Components/Support/RegisterUser/Index'

import SupportContactScreen from './Components/Support/Contact/Index'

import TermsScreen from './Components/Support/Terms/Index'
import PrivacyScreen from './Components/Support/Privacy/Index'
import DeviceScreen from './Components/Support/Device/Index'
import LoggedEventsScreen from './Components/Support/LoggedEvents/Index'
import LoggedEventDetailsScreen from './Components/Support/LoggedEvents/Detail'


let SupportStack = createStackNavigator({ 
  Support: {
    screen: SupportScreen,
    // to hide the back title for any child screens, it must be set to null here
    navigationOptions: ({ navigation }) => ({
      headerBackTitle: null
    }),
  },
  SupportList: {
    screen: SupportListScreen
  },
  SupportRegisterUser: {
    screen: SupportRegisterUserScreen
  },
  SupportRequest: {
    screen: SupportRequestScreen
  },
  SupportRequestDetail: {
    screen: SupportRequestDetailScreen
  },
  Contact: {
    screen: SupportContactScreen
  },
  Terms: {
    screen: TermsScreen
  },
  Privacy: {
    screen: PrivacyScreen
  },
  Device: {
    screen: DeviceScreen
  },
  LoggedEvents: {
    screen: LoggedEventsScreen
  },
  LoggedEventDetails: {
    screen: LoggedEventDetailsScreen
  } 
});


// *******************************************************************************
// Permissions
// *******************************************************************************

import PushNotificationsScreen from './Components/Permissions/PushNotifications/Index'

let PushNotificationsPermissionStack = createStackNavigator({ PushNotificationsScreen });

// let PushNotificationsPermissionStack = createStackNavigator({ 
//   PushNotifications: {
//     screen: PushNotificationsScreen,
//     // to hide the back title for any child screens, it must be set to null here
//     navigationOptions: ({ navigation }) => ({
//       headerBackTitle: null
//     }),
//   },


// });





// *******************************************************************************
// Session Override
// *******************************************************************************

import SessionOverrideScreen from './Components/SessionOverride/Index'

let SessionOverrideStack = createStackNavigator({ SessionOverrideScreen });


// *******************************************************************************
// Client Selection - USED IN 2 stacks
// *******************************************************************************
import ClientSelectionScreen from './Components/ClientSelection/Index'
let ClientSelectionStack = createStackNavigator({ ClientSelectionScreen });



// *******************************************************************************
// Drawer Items
// *******************************************************************************

import DrawerContainer from './Components/DrawerContainer'
import { from } from 'rxjs';

const DrawerStack = createDrawerNavigator({

  Tabs: { 
    screen: TabStack,
    navigationOptions: ({ navigation }) => ({

      // this drawer lable for the stack MUST be defined here for some 
      // react-navigation v2 squirrelly reason
      // drawerLabel: 'My Home',
      // drawerIcon: ({ tintColor }) => (
      //   <Image
      //     source={require('./Images/TabBar/clock-alarm-7.png')}
      //     style={[styles.icon, {tintColor: tintColor}]}
      //   />
      // ),

    }),

  },



  Modules: { 
    screen: ModulesStack,
  
    navigationOptions: ({ navigation }) => ({


    })

  },



  Account: { 
    screen: AccountStack,
  
    navigationOptions: ({ navigation }) => ({

    })

  },



  Support: { 
    screen: SupportStack,
  
    navigationOptions: ({ navigation }) => ({

    })

  },



  StaffList: { 
    screen: StaffListStack,
  
    navigationOptions: ({ navigation }) => ({

    })

  },



  ClientSelection: { 
    screen: ClientSelectionStack,
  
    navigationOptions: ({ navigation }) => ({

    })

  },

  SessionOverride: { 
    screen: SessionOverrideStack,
  
    navigationOptions: ({ navigation }) => ({

    })

  },



}, {
      // The drawerLabel is defined in DrawerContainer.js
      contentComponent: DrawerContainer,
})



// *******************************************************************************
// * the final combined stack
// *******************************************************************************

const AppStack = createStackNavigator({
  LaunchStack: { screen: LaunchStack },
  LoginStack: { screen: LoginStack },
  LockStack: { screen: LockScreenStack },
  DrawerStack: { screen: DrawerStack },
  PushNotificationsPermissionStack: { screen: PushNotificationsPermissionStack },
  PasswordChangeRequiredStack: { screen: PasswordChangeRequiredStack }

}, 



{
    initialRouteName: 'LaunchStack',
    // drawerPosition: 'left',
    // gesturesEnabled: true,
    // contentComponent: DrawerContainer,
    headerMode: 'none', // this is key for react-navigation v3
    navigationOptions: ({navigation}) => ({
      header: null
    })
  
})

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
});



// *******************************************************************************
// * the exported class
// *******************************************************************************

const AppContainer = createAppContainer(AppStack);


//export default AppStack
export default class App extends React.Component {


    constructor(props) {
        super(props);


        // This is a workaround to create a fake API request so that subsequent requests will work
        // The first API request ALWAYS times out
        // Authorization.WakeUpServer()

        this.state = {
          showLock: false,
          userData: null,
          selectedClient: null,
          superUser: null, 
          appState: AppState.currentState,
          alertCount: 0,
          messageCount: 0,
          newAlertCount : '',
          deleteState : false,
          backgroundColor :brand.colors.primary,
          settings : {
            switch1 : true,
            switch2 :true,
            switch3 :null,
            switch4 : null
          },
          isQA: false,
          logData: [],
          notificationCount : 0

        }

        // this kicks off a background timer loop to check things like forced re-login, etc.
        this.backgroundChatMessagesTimer()

        // this kicks off a background timer loop to check for notifications at set intervals
        this.backgroundNotificationsTimer()

    }


    componentDidMount() {

        //console.log("...root componentDidMount")
        AppState.addEventListener('change', this.onAppStateChange);

        this.setBadge()

        // this.interval = setInterval (() => this.setBadge()
        // ,60000)

        // let userData = this.props.screenProps.state.userData
        // let token = this.props.screenProps.state.userData.token
        // let client  = this.props.screenProps.state.selectedClient
  
        //this.checkPermission()
        

        firebase.messaging().getToken().then((token) => {
            this._onChangeToken(token)
            console.log('Rosnet: Comp MOunt get token')
        });
    
        firebase.messaging().onTokenRefresh((token) => {
            this._onChangeToken(token)
            console.log('Rosnet: Comp MOunt refresh token')

        });

       

        // This is triggered if the notification is tapped  --- when App is in the background
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((data) => {
       

          client = data.notification._data.client
          this.doClientChange(client)       
          NavigationService.navigate('Alerts',{deleteState:false});

        });

        //This is populated if the notification is tapped and opens the app --- when App is closed
        this.initialNotificationOpenedListener = firebase.notifications().getInitialNotification((data) => {
          
          client = data.notification._data.client
          this.doClientChange(client)
          NavigationService.navigate('Alerts',{deleteState:false});

        })

       // firebase.notifications().displayNotification(RNFirebase.notifications.Notification)

        //console.log("App-Rosnet config", config)

        // show QA indicator throughout the app
        if(config.DOMAIN.toLowerCase() === 'rosnetqa.com') {
          this.setState({ isQA: true })
        }


    } // end componentDidMount
    

   



    setBadge = () => {

        _this = this
        
        console.log('set bAdge called')

        if(_this.state.userData) {

          let request = {
            client : _this.state.selectedClient,
            token : _this.state.userData.token,
            userName : _this.state.userData.userName
          }

          getBadgeCount (request,function(err,resp){
            if (err) {
              console.log('Badge count error',err)
            }
            else {
              console.log('Badge count success',resp)
             
              _this.setState({
                newAlertCount : resp
              },()=>console.log('Badge :',_this.state.newAlertCount))
            }
          })

        } // end if userData

    } // end setBadge

    doClientChange = (client) => {

      // Do this AFTER state updates - this shares the persisted userData to the App-Rosnet.js wrapper
      this._globalStateChange( { action: "change-client", selectedClient:  client })
  
      const resetAction = StackActions.reset({
          index: 0,
          key: null, // this is the trick that allows this to work
          actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
      });
      NavigationService.navigate('Alerts',{deleteState: false});
  
    }

    _onChangeToken = (token) => {
      var data = {
        'device_token': token,
        //'device_type': Platform.OS,
        
      };
      console.log('Rosnet: On change token')

      console.log('Data data',data)
      if(data){
        AsyncStorage.setItem('firebaseToken',(data.device_token))
      }
    }

    async checkPermission() {
      const enabled = await firebase.messaging().hasPermission();
      if (enabled) {
          this.getToken();
      } else {
          this.requestPermission();
      }
    }
    
    //3
    async getToken() {
      console.log('Get permission')
      if (!fcmToken) {
          fcmToken =  firebase.messaging().getToken();
          if (fcmToken) {
              // user has a device token
               AsyncStorage.setItem('fcmDeviceToken', JSON.stringify(fcmToken));
               console.log('got permission',JSON.stringify(fcmToken))
          }
      }
    }
    
    //2
    async requestPermission() {
      try {
           firebase.messaging().requestPermission();
          // User has authorised
          this.getToken();
      } catch (error) {
          // User has rejected permissions
          console.log('permission rejected');
      }
    }

    componentWillUnmount() {
        //console.log("...root componentWillUnmount")
        AppState.removeEventListener('change', this.onAppStateChange);
    }


    //**********************************************************************************
    // globally log things
    //**********************************************************************************
    _globalLogger = (ok, source, title, message) => {

      // console.log("------- GLOBAL LOG EVENT -----------")
      // console.log(ok, source, title, message)
      // console.log("------- END GLOBAL LOG EVENT -----------")

      //Logger.LogEvent(ok, source, title, message)

      let MAX_LOG_ENTRIES = 50

      let logData = this.state.logData
      if(logData.length >= MAX_LOG_ENTRIES) {
        logData.splice(0, logData.length - MAX_LOG_ENTRIES)
      }

      let event = { 
          ok: ok, 
          source: source, 
          title: title, 
          message: message,
          ts: new Date().getTime() // add a timestamp to it for sorting
      }


      logData.push(event)

      this.setState({
        logData: logData
      })

    }

    //**********************************************************************************
    // globally share any state changes - just pass the object to update in the global state
    // these state values are shared throughout the app as this.props.screenProps.state.userData, etc.
    //**********************************************************************************
    _globalStateChange = (data) => {


        console.log("----------------------- GLOBAL STATE CHANGE -----------------------")
        console.log("data", data)

        if(data.userData) {

          this.setState({
            userData: data.userData
          })
          // }, () => console.log("global state change to userData", this.state.userData ) )

          // always save any changes to local storage
          AsyncStorage.setItem('userData', JSON.stringify(data.userData))

        }
        
        if(data.superUser) {

          this.setState({
            superUser: data.superUser
          })
          // }, () => console.log("global state change to superUser", this.state.superUser ) )

          
        }

        if(data.selectedClient) {

          this.setState({
            selectedClient: data.selectedClient
          })
          // }, () => console.log("global state change to selectedClient", this.state.selectedClient ) )

          // always save any changes to local storage
          AsyncStorage.setItem('selectedClient', data.selectedClient)

        }

        if (data.backgroundColor) {
          this.setState({
            backgroundColor : data.backgroundColor
          })
          // },() => console.log('global state change for bgColor',this.state.backgroundColor))
        }

        // this action will force the app to reset back to the real user
        if(data.action && (data.action === "undo-session-override" || data.action === "logout")) {

          this.setState({
            userData: data.userData,
            superUser: null,
            backgroundColor: brand.colors.primary
          })
          // }, () => console.log("global state change back to real user", data.userData ) )


        }
        
        // this will refresh the real user's token
        // this action will force the app to reset back to the real user
        if(data.action && data.action === "token-refresh") {

          this.setState({
            userData: data.userData,
            superUser: null,
            backgroundColor: brand.colors.primary
          })
          // }, () => console.log("global state change for token refresh", data.userData ) )
        }


        // cant use if(data.messageCount) since a zero value is interetpted as false
        if (data.action === 'chat-reset-unread-count') {
          this.setState({
            messageCount : data.messageCount
          })
          //},() => console.log('global state change messageCount',this.state.messageCount))
        }


    }



    //**********************************************************************************
    // check for things like forced re-login, etc.
    //**********************************************************************************
    backgroundChatMessagesTimer = () => {

      let _this = this
      
      if(this.state.userData) {

        Chat.GetUnreadMessageCount('rosnet', this.state.selectedClient, this.state.userData.token, function(err, resp){

          if(err) {

          }
          else {
            let total = 0
            if(resp && resp.length > 0) {
              resp.forEach(function(c){
                total += c.unread_count
              })
            }
            _this.setState({
              messageCount: total
            })
          }
        })

      }

      let timeout = 60000 // 60000 * 5 = 5 minutes
      setTimeout(_this.backgroundChatMessagesTimer, timeout);


    }

    //**********************************************************************************
    // check for alerts and things
    //**********************************************************************************
    backgroundNotificationsTimer = () => {

      let _this = this


      

      if(this.state.userData) {

        let userData = this.state.userData
        let token = this.state.userData.token
        let client  = this.state.selectedClient

        let request = {

          token : userData.token,
          client : client,
          userName : userData.userName,
          includeHidden : true

        }

        let alertCount = GetNotifications (request ,function(err,resp) {
          if (err){
            console.log ('Error siteSettings',err)
          }
          else {
            //console.log('response',resp)
            
    
              // resp.forEach(element => {
              //   title = element.Title
              //   text = element.PushText
              // });
              //console.log('modifiedresp',alertTypes)
    
             return resp.length
            
          }
    
        })

        let messageCount = generateRandomNumber(0,3)


        _this.setState({
          alertCount: alertCount
        })




      }

      let timeout = 60000 // 60000 * 5 = 5 minutes
      setTimeout(_this.backgroundNotificationsTimer, timeout);


    }



    onAppStateChange = (nextAppState) => {

      let _this = this

      let log = []

      //console.log("> handleAppStateChange <<<<<<<<")

      const { appState } = this.state

      // active, inactive, background
      // console.log('current appState', appState)
      // console.log('next appState   ', nextAppState)

      // IMPORTANT: ONLY check for "background" not "inactive" here or the LockScreen will render in a loop
      if (appState.match(/background/) && nextAppState === 'active') {

        console.log("+++++++++ STATUS ACTIVE ++++++++++")


        this._globalLogger(true, "App", "Activated", { state: this.state })


        // IMPORTANT: userData isn't nulled on logout out since it will cause other dependent screens to crash
        // only pasword and token are set to null
        if(this.state.userData && this.state.userData.token) {


          //console.log("userData", this.state.userData)


          Authorization.RefreshToken(function(err, resp){
            
            if(err) {
              console.log("err refreshing token", err)

              _this._globalLogger(false, "App", "Error Refreshing Token", { error: err})

            }
            else {

              console.log("token refreshed")

              // if we are refreshing the token, we must reset all global state attributes back to defaults as well
              _this._globalStateChange( { action: "token-refresh", userData: resp.userData })


              _this._globalLogger(false, "App", "Token Refreshed Successfully", { userData: resp.userData })
            

              // AFTER token refresh, which may cause 401 redirect to login, 
              // see if the user needs to see the lock screen
              Biometrics.CheckIfShouldShowLockScreen(function(result){

                if(result.showLock) {
                    // this is needed since props.navigation isn't present for unmounted screen components
                    NavigationService.navigate('LockStack');
                }


              })
            
            } // end else

          }) // end Authorization.RefreshToken


        } // end if userData
        else {
          console.log("user is not logged in, so dont show biometrics")
        }

          
      }
      else if (appState.match(/active/) && nextAppState === 'inactive') {

        console.log("+++++++++ STATUS INACTIVE ++++++++++")


        _this.resetBadge()

        console.log('******** Rest BAdge')

        // IMPORTANT: userData isn't nulled on logout out since it will cause other dependent screens to crash
        // only pasword and token are set to null
        if(this.state.userData && this.state.userData.token) {

          // IMPORTANT:
          // revert back to the real user if impersonating - 
          // THIS IS ESPECIALLY important if the user then exits/closes/terminates the app entirely.
          // Otherwise, when the user re-launches the app, they will still be logged in as an impersonator
          if(this.state.superUser) {
            console.log("reverting superUser back to ", this.state.superUser)
            let userData = this.state.superUser
            _this._globalStateChange( { action: "undo-session-override", userData: userData })

            // this is a lazy way to force all screens to reload 
            // and we don't have to undo the red background on every screen individually
            NavigationService.stackReset('DrawerStack')

          }


        }
        


        let statusData = {
          limit: 15000, // 10 seconds in milliseconds
          ts: new Date().getTime() // add a timestamp to it for sorting
        }

        AsyncStorage.setItem('statusData', JSON.stringify(statusData))

        _this._globalLogger(true, "App", "Inactivated", { statusData: statusData })



      }

      // keep track of last state
      this.setState({appState: nextAppState});

    }


    resetBadge = () => {

      _this = this
      


        console.log("App inactive :  reset badge called")

        console.log('AppState userData',_this.state.userData)

       
  
  
        AsyncStorage.getItem('deviceInfo').then((data) => {
          let deviceInfo = JSON.parse(data)
          appInstallId = deviceInfo.appInstallId
         
  
          AsyncStorage.getItem('firebaseToken').then((token) => {
            let fcmToken = token
            if(deviceInfo && fcmToken){
              let request = {
                appInstallId : deviceInfo.appInstallId,
                fcmDeviceToken : fcmToken,
                userId : _this.state.userData.userId,
                token : _this.state.userData.token,
                client : _this.state.selectedClient
              }
              console.log('Dash req:',request)

              resetBadgeCount(request,function(err,resp){

                if(err) {
                  console.log('errorrrrrr',err)
                }
                else {
                  console.log('badge success',resp)
                }
              })
             
            }
          })
         
        })
    }


    render() {

        // gets the current screen from navigation state
        function getCurrentRouteName(navigationState) {
          if (!navigationState) {
            return null;
          }
          const route = navigationState.routes[navigationState.index];
          // dig through the nested navigators
          if (route.routes) {
            return getCurrentRouteName(route);
          }
          return route.routeName;
        }

        return (

            <AppContainer 
              screenProps={{ 
                state: this.state, 
                _globalStateChange: this._globalStateChange,
                _globalLogger: this._globalLogger
              }} 

              // this is necessary for the NavigationService.navigate to LockStack to work
              ref={navigatorRef => {
                NavigationService.setTopLevelNavigator(navigatorRef)
              }}

              onNavigationStateChange={(prevState, currentState, action) => {

                // this isn't really useful currently, but keeping just in case...

                const currentScreen = getCurrentRouteName(currentState);
                const prevScreen = getCurrentRouteName(prevState);

                this.setState({
                  currentScreen: currentScreen,
                  prevScreen: prevScreen
                })

                //console.log("currentScreen", currentScreen)
                //console.log("prevScreen", prevScreen)

                if (prevScreen !== currentScreen) {
                  console.log('navigating to this screen', currentScreen);


                  // 5/18/2019 - IMPORTANT CHANGE: 
                  {/* 
                  We WERE excluding the LockScreen as the last screen since want to know where the user really left off and resume there.
                  However, if the user force closes the app when the LockScreen is shown, knowing that LockScreen
                  was the last screen used makes it easy with the current logic to not allow them to bypass it when it was necessary
                  to be shown. The downside is that we can only then resume at the Dashboard, since we lost track of where they really were. 
                  Is this an okay trade-off?  
                  */}
                  //if(currentScreen !== 'LockScreen') {
                    AsyncStorage.setItem('lastScreen', currentScreen)
                  //}
                } 
                
              }}

         
            />

        )
      

    }

}

