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
  WebView
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
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',
    headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.toggleDrawer() }
    />,

    // headerRight : 
    //   <View style={{
    //     alignItems: 'center',
    //     flexDirection: 'row',
    //     height: 40,
    //     paddingRight: 10,
    //     width: '100%'
    //   }}>
    //     <FontAwesome
    //         name="pencil-square-o"
    //         size={30}
    //         color={brand.colors.white}
    //         style={{ paddingRight: 10 }}
    //         onPress={() => navigate.navigation.navigate('EditAvailability') }
    //     />
    //   </View>,

    // The drawerLabel is defined in DrawerContainer.js
    // drawerLabel: 'Availability',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../Images/TabBar/calendar-7.png')}
    //     style={[Styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
  })

  constructor(props) {
      super(props);


      this.state = {
          sending: false,
          receiving: true,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userData: { sites: ["AAG", "DOHERTY"], selectedSite: "" },
          filtered: [ "AAG"],
          changed: false

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

    let userData = this.props.screenProps.state.userData

    console.log("ClientSelection", userData)

    
    _this.setState({
      userData: userData,
      filtered: userData.sites
    })

    
  }

 

  onSelectedSite = (value) => {

    console.log("changed site", value)

    let userData = this.state.userData
    userData.selectedSite = value

    this.setState({
      userData: userData,
      changed: true
    }, () => 
  
      this.doClientChange()
   );


  }

  doClientChange = () => {

      // Do this AFTER state updates - this shares the persisted userData to the App-Rosnet.js wrapper
      this.props.screenProps._globalStateChange( { action: "change-client", userData: this.state.userData })

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

    if(item === this.state.userData.selectedSite) {
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


        return (


                  <View style = {{marginTop:0}}>
          
                    <SearchBar
                      lightTheme={true}
                      color ='blue'
                      value={this.state.text}
                      placeholder='Search Term'
                      onChangeText = {(text)=> { this.matchSites(text) }}/>
            

                  
                    <ScrollView style={{ marginTop: -20 }}>

                      <List style={styles.list}>

                        {this.state.filtered.map((item, index) => (
                            <ListItem

                                hideChevron={true}
                                key={index}
                                style={styles.listItem}
                                title={item}
                                    titleStyle={{ color: brand.colors.gray }}
                                    
                                avatar={this.getAvatar(item)}
                                
                                onPress={() => { this.onSelectedSite(item) }}
                            
                            />
                          ))
                        }

                      </List>

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