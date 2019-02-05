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
import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'

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
          selectedSite: "",
          userData: { sites: ["AAG", "DOHERTY"] },
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

    let selectedSite = this.props.screenProps.state.selectedSite


    _this.setState({
      userData: userData,
      selectedSite: selectedSite
    })

    
  }

 

  onSelectedSite = (value) => {

    console.log("changed site", value)

    // this shares the persisted userData to the App-Rosnet.js wrapper
    this.props.screenProps._globalStateChange( { source: "ClientSelection", selectedSite: value })


    this.setState({
      selectedSite: value,
      changed: true
    })
  
  }


  render() {
        return (

              <View style={{ flex: 1,
                  marginTop: 40,
                  paddingLeft: 40,
                  paddingRight: 40,
                  justifyContent: 'space-around',
                  backgroundColor: brand.colors.white
              }}>
          

                  <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, color: brand.colors.primary }}>
                      To access Rosnet features for a different site, scroll to one of the sites listed below.</Text>
                  </View>


                  <View style={{ alignItems: 'center', marginBottom: 100 }}>
                    <Picker
                        selectedValue={this.state.selectedSite}
                        style={{ height: 40, width: '90%' }}
                        itemStyle={{
                            fontSize: 25,
                        }}
                        onValueChange={(itemValue, itemIndex) => this.onSelectedSite (itemValue)
                        }>
                        {this.state.userData && this.state.userData.sites && this.state.userData.sites.map(item => (
                            <Picker.Item 
                                key={item}
                                label={item} value={item} 
                            />
                        ))}
                    </Picker>
                  </View>


                   <View style={{ alignItems: 'center', marginBottom: 100 }}>

                    {/* <TouchableOpacity                 
                      onPress={() => {
                        this.onSelectedSite (this.state.selectedSite)
                        this.setState({ showClientModal: false }) ;
                      }} style={styles.button}>
                      <Text style={styles.buttonText}>
                        Continue
                      </Text>
                    </TouchableOpacity> */}

                      {this.state.changed &&
                    <Text style={{ textAlign: 'center', fontSize: 18, color: brand.colors.primary }}>


                      You have selected {this.state.selectedSite}

                    </Text>
                      }

                  </View> 

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