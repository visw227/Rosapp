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
  Keyboard
} from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import brand from '../../Styles/brand'
import Styles from './Styles'
import SearchBar from '../ReusableComponents/SearchBar'

import { NavigationActions, StackActions } from 'react-navigation'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome5Free from 'react-native-vector-icons/FontAwesome5'

import { searchUsers, impersonateUser } from '../../Services/SessionOverride';

import { parseUser } from '../../Helpers/UserDataParser';
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

  constructor(props) {
      super(props);


      this.state = {
          sending: false,
          receiving: false,
          userData: { sites: ["AAG", "DOHERTY"], selectedSite: "AAG" },
          items: [],
          query: '',
          showModal: false,
          impersonatedUser: {
            commonName: ''
          }
      }
  }

  // this will catch an global state updates - via screenProps
  componentWillReceiveProps(nextProps){

    let selectedSite = nextProps.screenProps.state.userData.selectedSite

    // ONLY if something has changed
    if(selectedSite !== this.state.userData.selectedSite){

      console.log(">>> Dashboard picked up new selectedSite: ", selectedSite)

      this.props.navigation.setParams({ title: 'Search ' + selectedSite + ' Users' })
      
      let userData = this.state.userData
      userData.selectedSite = selectedSite

      this.setState({ 
        userData: userData
      });


    }

  }

  componentDidMount() {


    let userData = this.props.screenProps.state.userData

    this.setState({
      userData: userData
    })

    this.props.navigation.setParams({ title: 'Search ' + userData.selectedSite + ' Users', menuIconClickHandler: this.onMenuIconClick })
    
  }

  onSelect = (item) => {

    let _this = this

    _this.setState({
      receiving: true
    })

    console.log("selected user: ", item)
    // this.props.navigation.navigate('ModulesWebView', { item: item })

    let userData = this.props.screenProps.state.userData

    let request = {
      userName: item.userName
    }

    impersonateUser(userData.selectedSite, item.token, request, function(err, response){

      if(err) {
        console.log("err", err)
      }
      else {
        console.log("response", response)

        // get the data for the user we are impersonating
        let impersonatedUser = parseUser(response)


        getMobileMenuItems(impersonatedUser.selectedSite, impersonatedUser.token, function(err, menuItems){
            
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

  doImpersonation = (mode) => {

      // always close the modal
      //this.setState({ showModal: false })

      // only do impersonation if the user presses 'Continue'
      if(mode === true) {
        // place the impersonated user's data into userData, but copy the "real" user into superUser so that we can revert back later...
        this.props.screenProps._globalStateChange( { action: "session-override", userData: this.state.impersonatedUser, superUser: this.props.screenProps.state.userData })
      
        const resetAction = StackActions.reset({
            index: 0,
            key: null, // this is the trick that allows this to work
            actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
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

    searchUsers(query, 100, this.state.userData.selectedSite, this.state.userData.token, function(err, resp){

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

      if(this.state.query === '') {
        return (
          <Text style={{color: brand.colors.primary }}>{'Please enter a user name'}</Text>
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



    return (
      
      <View style={styles.container}>

        <View style = {{marginTop:20}}>
          
          <SearchBar
            lightTheme={true}
            color ='blue'
            value={this.state.text}
            placeholder='Search Users'
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

          <View style ={{marginTop : -20}}>
          
            <ScrollView>

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

            </ScrollView>

          </View>
        
        }


            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.showModal}
              onRequestClose={() => {
                this.setState({ showModal: false })
              }}>
              <View style={{ flex: 1,
                  marginTop: 40,
                  paddingLeft: 40,
                  paddingRight: 40,
                  justifyContent: 'space-around',
                  backgroundColor: brand.colors.white
              }}>
          
                  <View style={{ alignItems: 'center'}}>

                    <FontAwesome5Free
                        name="smile-wink"
                        size={100}
                        color={brand.colors.primary}
                        style={{ marginBottom: 50 }}
                    />

                    <Text style={{ textAlign: 'center', fontSize: 35, color: brand.colors.primary }}>
                      Well, hello "{this.state.impersonatedUser.commonName}"!
                    </Text>

                  </View>

                  <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: brand.colors.primary }}>
                      Would like to do a session override as {this.state.impersonatedUser.commonName}?
                    </Text>
                  </View>


                  <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: brand.colors.primary }}>
                      You can undo this action by clicking the swap icon in the left drawer menu.
                    </Text>
                  </View>


                  <View style={{ alignItems: 'center', marginBottom: 100 }}>



                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        onPress={() => {
                                this.doImpersonation(true)
                              }}>
                        <Text  style={styles.buttonText}>Continue</Text>
                    </TouchableOpacity> 

                    <TouchableOpacity 
                        style={styles.buttonContainer}
                        onPress={() => {
                                this.doImpersonation(false)
                              }}>
                        <Text  style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity> 


                  </View>

              </View>
            </Modal>



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