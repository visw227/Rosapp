import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Platform, Image, AsyncStorage, Linking } from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../Styles/brand'

import Styles from './Styles'

import logo from '../../Images/logo-lg-white-square.png';

import FontAwesome5Free from 'react-native-vector-icons/FontAwesome5'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Communications from 'react-native-communications'


class Contact extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Social Media',

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


  })

  constructor(props) {
      super(props);


      this.state = {
        links: {
          facebook: {
            app: 'facebook://app',
            web: 'https://www.facebook.com/Rosnet',
            link: ''
          },
          twitter: {
            app: 'twitter://app',
            web: 'https://twitter.com/Rosnet4U',
            link: ''
          },
          linkedin: { 
            app: 'linkedin://app',
            web: 'https://www.linkedin.com/company/rosnet-restaurant-operations-support-network-',
            link: ''
          }
        }
      }
  }


  componentDidMount() {

    let links = this.state.links

    links.facebook.link = this.checkForApp(links.facebook)
    links.twitter.link = this.checkForApp(links.twitter)
    links.linkedin.link = this.checkForApp(links.linkedin)

  }


  checkForApp = (app) => {


    Linking.canOpenURL(app.app)
      .then((supported) => {
        if (!supported) {
          app.link = app.web
          console.log(app.app + " NOT found");
          //return app.web
        } else {
          app.link = app.web
          console.log(app.app + " found");
          //return app.app
        }
      })
      .catch((err) => console.error('An error occurred looking for ' + app.app, err))

      return app.link

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
                    <Text style={{ textAlign: 'center', fontSize: 22,  color: brand.colors.primary }}>
                      We are social!
                    </Text>
                  </View>


                  <View style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: brand.colors.primary }}>
                      Visit us on Facebook, Twitter, and LinkedIn.
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 100 }}>



                    <TouchableOpacity 
                        style={{
                          borderWidth:1,
                          borderColor: brand.colors.secondary,
                          alignItems:'center',
                          justifyContent:'center',
                          width:80,
                          height:80,
                          backgroundColor: brand.colors.secondary,
                          borderRadius:100,
                          marginRight: 10
                        }}
                        onPress={() => Linking.openURL(this.state.links.facebook.link) }>
                        <FontAwesome name={"facebook"} size={30} style={{ marginLeft: 20, marginRight: 15, color: brand.colors.white}} />
                    </TouchableOpacity> 


                    <TouchableOpacity 
                        style={{
                          borderWidth:1,
                          borderColor: brand.colors.secondary,
                          alignItems:'center',
                          justifyContent:'center',
                          width:80,
                          height:80,
                          backgroundColor: brand.colors.secondary,
                          borderRadius:100,
                          marginRight: 10
                        }}
                        onPress={() => Linking.openURL(this.state.links.twitter.link) }>
                        <FontAwesome name={'twitter'} size={25} style={{ marginLeft: 20, marginRight: 15, color: brand.colors.white}} />
                    </TouchableOpacity> 

                    
                    <TouchableOpacity 
                        style={{
                          borderWidth:1,
                          borderColor: brand.colors.secondary,
                          alignItems:'center',
                          justifyContent:'center',
                          width:80,
                          height:80,
                          backgroundColor: brand.colors.secondary,
                          borderRadius:100,
                          marginRight: 10
                        }}
                        onPress={() => Linking.openURL(this.state.links.linkedin.link) }>
                        <FontAwesome name={'linkedin'} size={25} style={{ marginLeft: 20, marginRight: 15, color: brand.colors.white}} />
                    </TouchableOpacity> 



                  </View>

              </View>
    );
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
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center'
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




//make this component available to the app
export default Contact;