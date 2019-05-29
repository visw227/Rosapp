
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  TouchableOpacity
} from 'react-native';

import moment from 'moment'

import { List, ListItem, Avatar } from 'react-native-elements'

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../../Styles/brand'
import Styles from './Styles'


import AvatarInitials from '../../ReusableComponents/AvatarInitials'

import { Utils } from '../../../Helpers/Utils'

import { Zendesk } from '../../../Helpers/Zendesk'


class SupportList extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'Support Requests',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',

    headerRight : 
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 10,
        width: '100%'
      }}>

        <Entypo
            name="plus"
            size={30}
            color={brand.colors.white}
            style={{ marginRight: 10 }}
            //onPress={() => navigate.navigation.navigate('SupportRequest') }
            onPress={navigate.navigation.getParam('handleSubmit')} 
        />

      </View>,



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
          registered: false,
          data: [],
          wasAlreadySent: false // used if we create a new user on the fly (when we have the email address)
      }


  }

  handleSubmit = () => {

    // don't allow a request to be submitted if not a registered user
    if(this.state.registered) {
      this.props.navigation.navigate('SupportRequest')
    }

  }

  componentDidMount () {

    let _this = this

    // componentDidMount only fires once
    // willFocus will cause the list to reload after a user submits a new request and returns
    this.props.navigation.addListener('willFocus', this.loadData)


    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
        title: this.props.screenProps.state.selectedClient,
        backgroundColor:this.props.screenProps.state.backgroundColor,
        handleSubmit: this.handleSubmit,
    })




  }


  loadData = () => {

    let _this = this

    this.setState({
        receiving: true,
        requestStatus: {
            hasError: false,
            message: null
        },
        data: []
    })

    console.log("getting requests for ", this.props.screenProps.state.userData.email)

    let userData = this.props.screenProps.state.userData
    let client = this.props.screenProps.state.selectedClient
    let token = userData.token

    console.log("calling Zendesk.GetRequests...")
    Zendesk.GetRequests(userData, client, token, function(err, resp){

      if(err) {

        // if the session.ZendeskEmail is null or empty, give the user a chance to enter an email address
        if(err.missingEmail) {

          _this.props.navigation.navigate('SupportRegisterUser')

        }
          // if a Zendesk error occurs, not sure what we can do
        else {

          _this.setState({
            receiving: false,
            requestStatus: {
                hasError: false,
                message: err
            }
          })


        }

      }
      else {

        _this.setState({
          receiving: false,
          requestStatus: {
              hasError: false,
              message: null
          },
          data: resp,
          registered: true
        })

      }

    })



  }




  getAvatar = (item) => {

      // new, solved, closed

      if(item.status === "closed" || item.status === "solved")
        return (
          <View
              style={{
                  borderWidth:1,
                  borderColor: brand.colors.secondary,
                  alignItems:'center',
                  justifyContent:'center',
                  width:40,
                  height:40,
                  backgroundColor: brand.colors.secondary,
                  borderRadius:100,
                  marginRight: 0
                }}
            >
              <FontAwesome name={'support'} size={25} color={brand.colors.white} />
            </View>
        )
      else {
        return (
          <View
              style={{
                  borderWidth:1,
                  borderColor: brand.colors.secondary,
                  alignItems:'center',
                  justifyContent:'center',
                  width:40,
                  height:40,
                  backgroundColor: brand.colors.success,
                  borderRadius:100,
                  marginRight: 0
                }}
            >
              <FontAwesome name={'support'} size={25} color={brand.colors.white} />
            </View>
        )
      }


  }

  getCountDisplay = (count) => {

    if(count === 1) {
      return count + ' request found'
    }
    else {
      return count + ' requests found'
    }

  }

  render() {

    return (


          <ScrollView
            style={{ backgroundColor: '#ffffff' }}
            refreshControl={

              <RefreshControl
                refreshing={this.state.receiving}
                onRefresh={this.loadData}
                tintColor={brand.colors.primary}
                title="Loading"
                titleColor={brand.colors.primary}
                //colors={['#ff0000', '#00ff00', '#0000ff']}
                progressBackgroundColor="#ffffff"
              />
            }
            
          >




            {this.state.registered && !this.state.receiving && this.state.data.length === 0 &&
              <View>
                  <Text style={styles.message} >
                    Press the <Entypo
                      name="plus"
                      size={15}
                      color={brand.colors.primary}
                  /> icon to start a new support request.
                  </Text>

              </View>
            }


            {this.state.registered && !this.state.receiving && !this.state.requestStatus.hasError && this.state.data.length > 0 && 
            <View>

                <Text style={styles.message} >
                    {this.getCountDisplay(this.state.data.length)}
                </Text>

                  {/* <TouchableOpacity 
                      style={ styles.buttonContainer }
                      onPress={() => this.props.navigation.navigate('SupportRegisterUser') }>
                      <Text  style={ styles.buttonText }>Test Register</Text>
                  </TouchableOpacity>  */}


                <List style={Styles.list}>


                  {
                    this.state.data && this.state.data.map((l, i) => (


                      <ListItem
                          key={l.id}
                          roundAvatar
                          style={Styles.listItem}
                          title={

                            <Text style={Styles.title} numberOfLines={1} ellipsizeMode ={'tail'} >
                              {l.subject}
                            </Text>

                          }

                          subtitle={
       
                            <Text style={Styles.subtitleView} numberOfLines={2} ellipsizeMode ={'tail'} >
                              {l.description}
                            </Text>

                          }
                          avatar={this.getAvatar(l)}
                          
                          onPress={() => this.props.navigation.navigate('SupportRequestDetail', { requestItem: l }) }
                      
                      />

                    ))
                  }

                </List>
   
              </View>
              }
          </ScrollView>

    );
  }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.white,

    },
    formContainer: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginTop: 5,
        marginBottom: 5,
        padding: 10,
        color: brand.colors.primary,
        borderColor: brand.colors.primary, 
        borderWidth: 1,
        borderRadius: 10
    },
    textArea: {
      height: 100
    },
    inputLabel: {
      color: brand.colors.primary,
      marginTop: 15, 
      marginLeft: 5
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 30, 
      paddingRight: 30,
      color: brand.colors.primary
    },
    buttonContainer:{
        marginTop: 20,
        marginLeft: 50,
        marginRight: 50,
        backgroundColor: brand.colors.white,
        paddingVertical: 15,
        borderRadius: 30,
        borderColor: brand.colors.primary, 
        borderWidth: 0,
    },
    buttonText:{
        color: brand.colors.primary,
        textAlign: 'center',
        fontWeight: '500'
    }, 
   
});

//make this component available to the app
export default SupportList;