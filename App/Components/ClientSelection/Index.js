import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  SectionList,
  Alert,
  TouchableHighlight,
  Modal,
  Picker,
  WebView,
  Keyboard,
  ActivityIndicator
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation'

import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'

import SearchBar from '../ReusableComponents/SearchBar'


export class About extends React.Component {



    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Select a Site',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
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


  constructor(props) {
      super(props);


      this.state = {
          sending: false,
          receiving: false,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userData: this.props.screenProps.state.userData,
          filtered: this.props.screenProps.state.userData.sites,
          changed: false,
          selectedClient: this.props.screenProps.state.selectedClient

      }

      props.navigation.addListener('willFocus', () => this.willFocus())
      props.navigation.addListener('willBlur', () => this.willBlur())


  }

  willFocus = () => {

    console.log("willFocus...")
    this.setState({changed: false})

  }
  willBlur = () => {
    console.log("willBlur...")
    this.setState({changed: false})
  }


  componentDidMount() {

    let _this = this 

    //let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      title: this.props.screenProps.state.selectedClient,
      backgroundColor:this.props.screenProps.state.backgroundColor,
      menuIconClickHandler: this.onMenuIconClick
    })


    // console.log("ClientSelection", userData)

    
    // _this.setState({
    //   userData: userData,
    //   filtered: userData.sites
    // })

    
  }

 

  onSelectedClient = (client) => {

    console.log("changed site", client)


    this.setState({
      changed: true,
      receiving: true,
      selectedClient: client
    }, () => 
  
      // just to prove to the user that something has happened when the user selects a site
      setTimeout(() => {
        this.doClientChange(client)
      }, 1000)

   );


  }

  doClientChange = (client) => {

    // Do this AFTER state updates - this shares the persisted userData to the App-Rosnet.js wrapper
    this.props.screenProps._globalStateChange( { action: "change-client", selectedClient:  client })

    const resetAction = StackActions.reset({
        index: 0,
        key: null, // this is the trick that allows this to work
        actions: [NavigationActions.navigate({ routeName: 'DrawerStack' })],
    });
    this.props.navigation.dispatch(resetAction);

  }

  matchSites = (query) => {

    console.log("query", query)

    let filtered = this.state.userData.sites.filter(item => item.toLowerCase().indexOf(query.toLowerCase()) !== -1)

    this.setState({
      filtered: filtered
    })

  }

  getAvatar = (item) => {

    if(item === this.state.selectedClient) {
      return (
          <Avatar rounded medium
                  overlayContainerStyle={{backgroundColor: 'green'}}
                  icon={{name: 'check', type: 'font-awesome', size: 20}}/>
      )
    }
    else {
      return (
          <Avatar rounded medium
                  overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                  icon={{name: 'window-restore', type: 'font-awesome', size: 20}}/>
      )
    }

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


                  <View style = {{marginTop:0}}>
          
                    <SearchBar
                      lightTheme={true}
                      color ='blue'
                      value={this.state.text}
                      placeholder='Search Sites'
                      onChangeText = {(text)=> { this.matchSites(text) }}/>


                    {/* This will allow the alert message to flex correctly for tablets too */}
                                
                    {this.state.receiving &&
                      <View style={{ 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          marginBottom: 15,
                          marginTop: 10
                      }}>
                          <Text style={{color: brand.colors.primary }}>Changing site to {this.state.selectedClient}...</Text>
                      </View>
                    }

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
                    
                  
                    <ScrollView style={{ marginTop: 0 }}>

                      <View style ={{marginTop : -20}}>


                        <List style={styles.list}>

                          {this.state.filtered.map((item, index) => (
                              <ListItem

                                  hideChevron={true}
                                  key={index}
                                  style={styles.listItem}
                                  title={item}
                                      titleStyle={{ color: brand.colors.gray }}
                                      
                                  avatar={this.getAvatar(item)}
                                  
                                  onPress={() => { this.onSelectedClient(item) }}
                              
                              />
                            ))
                          }

                        </List>

                      </View>

                    </ScrollView>

                  </View>



        )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    backgroundColor: brand.colors.white,
    paddingLeft: 40,
    paddingRight: 40
  },
  list: {
    marginTop: -20,
    paddingTop: 0,
    paddingBottom: 0
  },
    logoContainer:{
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        // position: 'absolute',
        // width: 400,
        // height: 200
    },
  text: {
    fontSize: 18,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 50,
    backgroundColor: brand.colors.secondary,
    borderRadius: 5,
    marginTop: 80
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'   
  }
});

//make this component available to the app
export default About;