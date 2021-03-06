import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  TextInput, 
  Image, 
  ActivityIndicator,
  Modal,
  Keyboard,
  AsyncStorage
} from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import brand from '../../Styles/brand'
import Styles from './Styles'
import SearchBar from '../ReusableComponents/SearchBar'

import { NavigationActions, StackActions } from 'react-navigation'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome5Free from 'react-native-vector-icons/FontAwesome5'

import { searchUsers, impersonateUser } from '../../Services/SessionOverride';

import { Parsers } from '../../Helpers/Parsers';
import { getMobileMenuItems } from '../../Services/Menu';

class SearchUsers extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    //title: 'Search Rosnet Users',
    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Search Rosnet Users': navigate.navigation.state.params.title,


    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',
        headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.state.params.menuIconClickHandler(navigate) }
    />,

  })


  constructor(props) {
      super(props);


      this.state = {
          sending: false,
          receiving: false,
          userData: this.props.screenProps.state.userData,
          items: [],
          query: '',
          showModal: false,
          impersonatedUser: {
            commonName: ''
          },
          userData: this.props.screenProps.state.userData,
          selectedClient: this.props.screenProps.state.selectedClient
      }
  }


  componentDidMount() {

    // componentDidMount only fires once
    // willFocus instead of componentWillReceiveProps
    this.props.navigation.addListener('willFocus', this.load)

  }


  load = () => {

    this.setState({ 
      selectedClient: this.props.screenProps.state.selectedClient
    });


    this.props.navigation.setParams({ 
      title: 'Search ' + this.props.screenProps.state.selectedClient + ' Users', 
      menuIconClickHandler: this.onMenuIconClick 
    })
    
  }

    // needed a way to perform multiple actions: 1) Dismiss the keyboard, 2) Open the Drawer
  // this is passed in to navigationOptions as menuIconClickHandler
  onMenuIconClick = (navigate) => {

    navigate.navigation.toggleDrawer()
    Keyboard.dismiss()

  }



  getTitle = (navigate) => {

    if(typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title)) {
       return 'Search Rosnet Users'
    }
    else {
       return navigate.navigation.state.params.title
    }


  }
  
  onSelect = (item) => {

    let _this = this

    this.setState({
      receiving: true,
      selectedUser: item
    })

    console.log("selected user: ", item)
    // this.props.navigation.navigate('ModulesWebView', { item: item })

    let userData = this.props.screenProps.state.userData


    AsyncStorage.getItem('deviceInfo').then((data) => {

        //console.log("refreshToken loginData", data)

        if(data) {

            deviceInfo = JSON.parse(data)

            // the request looks almost like a regular login request because the API demands it for its logic
            // that reuses LoginFacade.LoginUserApp(req, { true for impersonation})
            let request = {
                userName: item.userName, 
                //password: password,  // not needed here
                deviceUniqueId: deviceInfo.deviceUniqueId,
                appInstallId: deviceInfo.appInstallId,
                deviceType: deviceInfo.deviceType,
                appVersion: deviceInfo.appVersion,
                appBuild: deviceInfo.appBuild,
                systemName: deviceInfo.systemName,
                systemVersion: deviceInfo.systemVersion,
                userAgent: deviceInfo.userAgent
            }


            impersonateUser(_this.props.screenProps.state.selectedClient, userData.token, request, function(err, response){

              if(err) {
                console.log("err", err)
              }
              else {
                console.log("response", response)

                // get the data for the user we are impersonating
                let impersonatedUser = Parsers.UserData(response)
                // we are including password in the userData for the change password screen to have access the current password for validation
                impersonatedUser.password = "****" // just something so that in Rosnet.js inactive->active state change will consider the user logged in 


                getMobileMenuItems(_this.props.screenProps.state.selectedClient, impersonatedUser.token, function(err, menuItems){
                    
                    if(err) {
                        console.log("err - getMobileMenuItems", err)
                        _this.showAlert(err.message)

                        _this.setState({
                          receiving: false
                        })

                    }
                    else {

                        _this.setState({
                          //showModal: true,
                          receiving: false
                        })

                        // rename the FontAwesome icons by removing the fa- preface
                        menuItems.forEach(function(item){
                            item.icon = item.icon.replace('fa-', '')
                        })

                        impersonatedUser.menuItems = menuItems

                        _this.setState({
                          impersonatedUser: impersonatedUser
                        }, () => 
          
                            // Do this AFTER state updates - this shares the persisted userData to the App-Rosnet.js wrapper
                            _this.doImpersonation(true)
                        )


                    }

                })



              }


            })



        }


    })







  }

  doImpersonation = (mode) => {

      // always close the modal
      //this.setState({ showModal: false })

      // only do impersonation if the user presses 'Continue'
      if(mode === true) {
        // place the impersonated user's data into userData, but copy the "real" user into superUser so that we can revert back later...
        this.props.screenProps._globalStateChange({ 
            action: "session-override", 
            userData: this.state.impersonatedUser, 
            superUser: this.props.screenProps.state.userData, 
            backgroundColor:brand.colors.danger})
        
        // reset the stack so that screen header colors turn red
        const resetAction = StackActions.reset({
            index: 0,
            key: null, // this is the trick that allows this to work
            actions: [NavigationActions.navigate({ routeName: 'DrawerStack'})],
        });
        this.props.navigation.dispatch(resetAction);

      }


  }

  getUsers = (query) => {

    // require at least 3 characters
    if(query.length < 3) {
      return
    }

    let _this = this

    this.setState({
      receiving: true
    })

    searchUsers(query, 100, this.state.selectedClient, this.state.userData.token, function(err, resp){

      if(err) {
        _this.setState({
          receiving: false,
          query: query,
          items: []
        })
      }
      else {
        _this.setState({
          receiving: false, 
          query: query,
          items: resp
        })
      }


    })

  }

  render() {


    getResultsMessage = () => {

      if(this.state.selectedUser && this.state.receiving) {
          return (
            <Text style={{color: brand.colors.primary }}>Impersonating {this.state.selectedUser.name}...</Text>
          )
      }
      else {
        if(this.state.query === '') {
          return (
            <Text style={{color: brand.colors.primary }}>{'Please enter a user name or user group'}</Text>
          )
        }
        else if(this.state.query != '' && this.state.items.length === 1) {
          return (
            <Text style={{color: brand.colors.primary }}>{this.state.items.length + ' user found'}</Text>
          )
        }
        else if(this.state.query != '' && this.state.items.length > 1) {
          return (
            <Text style={{color: brand.colors.primary }}>{this.state.items.length + ' users found'}</Text>
          )
        }
        else if(this.state.query != '' && this.state.items.length === 0) {
          return (
            <Text style={{color: brand.colors.primary }}>{'Sorry, no users found.'}</Text>
          )
        }
      }

    }



    return (
      
      <View style={styles.container}>

        <View style = {{marginTop:20}}>
          
          <SearchBar
            lightTheme={true}
            color ='blue'
            value={this.state.text}
            placeholder='Please enter a user name or user group'
            onChangeText = {(text)=> { this.getUsers(text) }}/>
            
        </View>


        {/* This will allow the alert message to flex correctly for tablets too */}
        <View style={{ 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 10
        }}>
            {getResultsMessage()}
        </View>
 
        
        {this.state.receiving &&
          <View style={{ 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 15,
              marginTop: 10
          }}>
              <ActivityIndicator size="large" color={brand.colors.primary} />
          </View>
        }

        
        {this.state.items.length > 0 &&


          
            <ScrollView>

              <View style ={{marginTop : -20}}>

                <List style={styles.list}>

                  {this.state.items.map((item, index) => (
                      <ListItem

                          key={index}
                          style={styles.listItem}
                          title={item.name}
                              titleStyle={{ color: brand.colors.gray }}
                              
                          subtitle={
                          <View style={styles.subtitleView}>
                              <Text style={styles.ratingText}>{item.group}</Text>
                          </View>
                          }
                          avatar={<Avatar rounded medium
                              overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                              icon={{name: 'user-o', type: 'font-awesome'}}/>}
                          
                          onPress={() => { this.onSelect(item) }}
                      
                      />
                    ))
                  }

                </List>

              </View>
        

            </ScrollView>

    
        }


      </View>

    ) 

  }


} 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginTop: -20
  },
    buttonContainer:{
        backgroundColor: brand.colors.white,
        paddingVertical: 15,
        borderRadius: 30,
        borderColor: brand.colors.primary, 
        borderWidth: 2,
        width: 300,
        marginBottom: 10
    },
    buttonText:{
        color: brand.colors.primary,
        textAlign: 'center',
        fontSize: 15
    },  
  loader : {
    flex:1,
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:30
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  list: {
    marginTop: -20,
    paddingTop: 0,
    paddingBottom: 0
  },
  listItem: {
    marginBottom: 10
  },
  ratingText: {
    paddingLeft: 0,
    color: '#808080'
  },
  tile: {
    alignItems: "center",
    backgroundColor: brand.colors.secondary,
    flexGrow: 1,
    flexBasis: 0,
    margin: 2,
    padding: 20
  },
  item: {
    alignItems: "center",
  },
  text: {
    color: 'white',
    fontWeight: 'normal',
  }
});

export default SearchUsers;