

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

import brand from '../../Styles/brand'
import Styles from './Styles'

import AvatarInitials from '../ReusableComponents/AvatarInitials'
import LocationButtons from '../ReusableComponents/LocationButtons';
import { GetNotifications,resetBadgeCount } from '../../Services/Push';
import AlertMessage from '../Modules/AlertMessage';


class AlertsScreen extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'Alerts',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
    headerTintColor: 'white',
    headerLeft : <Ionicon
        name="md-menu"
        size={35}
        color={brand.colors.white}
        style={{ paddingLeft: 10 }}
        onPress={() => navigate.navigation.toggleDrawer() }
    />,


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
            onPress={() => navigate.navigation.navigate('AlertCreate') }
        />

      </View>,



  })

    constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userToken: '',
          data: [],
          title : null,
          text : null,
          loading: true,
         
      }


  }

  renderNotification = () => {
    _this = this
    let userData = this.props.screenProps.state.userData
      let token = this.props.screenProps.state.userData.token
      let client  = this.props.screenProps.state.selectedClient

      let request = {

         token : userData.token,
         client : client,
         userName : userData.userName,
         includeHidden : true

      }
    GetNotifications (request ,function(err,resp) {
      if (err){
        console.log ('Error siteSettings',err)
      }
      else {
        console.log('response',resp)
        

          // resp.forEach(element => {
          //   title = element.Title
          //   text = element.PushText
          // });
          //console.log('modifiedresp',alertTypes)

          _this.setState ({
            data : resp
          })

        
      }

    })
  }



  componentDidMount () {

      let _this = this 

      let userData = this.props.screenProps.state.userData
      let token = this.props.screenProps.state.userData.token
      let client  = this.props.screenProps.state.selectedClient

      



      

      let request = {

         token : userData.token,
         client : client,
         userName : userData.userName,
         includeHidden : true,
         appInstallId : this.state.appInstallId,
         fcmDeviceToken : this.state.fcmDeviceToken

      }

      

      
      // NOtifications are initially rendered when component is mounted
      _this.renderNotification()

      // This call the api for every 5secs to render new added notifications
      _this.interval = setInterval (() => _this.renderNotification()
      ,5000)

      this.props.navigation.setParams({ 
        backgroundColor:this.props.screenProps.state.backgroundColor 
      })

  }

  componentWillUnMount(){
    clearInterval(this.interval)
  }


  getAvatar = (item) => {

      if(item)
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
              <FontAwesome name={'bell'} size={25} color={brand.colors.white} />
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
                  backgroundColor: brand.colors.secondary,
                  borderRadius:100,
                  marginRight: 0
                }}
            >
              <Entypo name={'email'} size={22} color={brand.colors.white} />
            </View>
        )
      }


  }

  renderLoading = () => {
    
    {this.state.data.length <1  ? <AlertMessage title={'Loading Alerts..'}/> : null}
    
  }

  renderAlertMEssage = () => {
    
    {this.state.data.length <1 && this.state.loading === false ? <AlertMessage title={'No Alerts to Display'}/> : null}
  }

  render() {
    
    return (

      
          <View>

           
           {this.state.data.length <1  && <AlertMessage title={'No Alerts to Display at this time'}/> }

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


            <View style={{ marginTop: -20 }} >

              {!this.state.receiving &&

                <List style={Styles.list}>


                  {
                    this.state.data.map((l, i) => (


                      <ListItem
                          key={l.AlertTypeId}
                          roundAvatar
                          style={Styles.listItem}
                          title={

                            <Text style={Styles.title} numberOfLines={1} ellipsizeMode ={'tail'} >
                              {l.Title}
                            </Text>

                          }

                          subtitle={
       
                            <Text style={Styles.subtitleView} numberOfLines={2} ellipsizeMode ={'tail'} >
                              {l.PushText}
                            </Text>

                          }
                          avatar={this.getAvatar(l)}
                          
                          onPress={() => this.props.navigation.navigate('AlertDetail', { request: l }) }
                      
                      />

                    ))
                  }

                </List>
              }
              </View>
           
          </ScrollView>
          </View>

    );
  }
}


//make this component available to the app
export default AlertsScreen;