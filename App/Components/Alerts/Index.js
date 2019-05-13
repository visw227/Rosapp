

import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList
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
import { GetNotifications,resetBadgeCount,getOpenedAlertsCount,updateOpenAlertsCount} from '../../Services/Push';
import AlertMessage from '../Modules/AlertMessage';
import { template } from 'handlebars';


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
          openedAlerts :[],
          newOpenAlerts :[],
          title : null,
          text : null,
          loading: true,
          req : {
            client : _this.props.screenProps.state.selectedClient,
            token : _this.props.screenProps.state.userData.token,
            userName : _this.props.screenProps.state.userData.userName,
            
          }         
  }
    }

  renderNotification = () => {
    _this = this
    let userData = _this.props.screenProps.state.userData
      let token = _this.props.screenProps.state.userData.token
      let client  = _this.props.screenProps.state.selectedClient

      let request = {

         token : userData.token,
         client : client,
         userName : userData.userName,
         includeHidden : true

      }
    GetNotifications (request ,function(err,resp) {
      if (err){
        console.log ('Error siteSettings',err )
      }
      else {
        console.log('response',resp)
        

          // resp.forEach(element => {
          //   title = element.Title
          //   text = element.PushText
          // });
          //console.log('modifiedresp',alertTypes)

          _this.setState ({
            data : resp.reverse()
          },()=> console.log('<<data',_this.state.data))

        
      }

    })
   
      var newData = []
      if(_this.state.data){
        _this.state.data.forEach(el => {
          if(el) {
            newData.push(el.AlertID)
          }
        })
      }

   
     
    
  }

    

  componentDidMount () {

      let _this = this 


      // NOtifications are initially rendered when component is mounted
      _this.renderNotification()

      _this._getOpenAlertsCount(_this.state.req)

      // This call the api for every 15secs to render new added notifications
      _this.interval = setInterval (() => _this.renderNotification()
      ,15000)

      this.props.navigation.setParams({ 
        backgroundColor:this.props.screenProps.state.backgroundColor 
      })

      

      if(_this.state.data && _this.state.data.length > 0) {
        var temp = []
        _this.state.data.forEach(e => {
          temp.push(e.AlertID)
        })
  
      }
     
      if(_this.state.newOpenAlerts && _this.state.newOpenAlerts.length > 0){
        newAlertCount = temp.length - _this.state.newOpenAlerts.length
        this.props.screenProps._globalStateChange( { action: "Badge-count", newAlertCount:  newAlertCount })
      }

  }

  onPress = (l,req) => {

   _this = this
   
    updateOpenAlertsCount(req,l.AlertID,function(err,resp){
      if (err) {
        console.log('update open alerts error',err + "request" + req)
      }
      else {
        console.log('update open alerts success',resp)

        _this._getOpenAlertsCount(_this.state.req)


      }
    })
    _this.props.navigation.navigate('AlertDetail',{'request':l})

    var newData = []
    if(_this.state.data){
      _this.state.data.forEach(el => {
        if(el) {
          newData.push(el.AlertID)
        }
      })
    }

  
   
  }


  _getOpenAlertsCount = (req) => {

    console.log('<<<<<On press call')
    getOpenedAlertsCount(req,function(err,resp){

      if (err) {
        console.log('get alert count error',err)
      }

      else {
        console.log('get alert count success',resp)

        var buffer = []

        resp.forEach(e => {
          buffer.push(e.Alert_ID)
        })
        _this.setState({
          newOpenAlerts : buffer
        }, ()=> {
          console.log('get alert :',_this.state.newOpenAlerts)
        })
      }

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

    var alerts = []
    
    if(this.state.data && this.state.data.length > 0) {
       //reverseData = this.state.data.reverse()

       alerts = this.state.data   //data is now reversed in setState method itself
    }

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
                    alerts.map((l, i) => (
                      
                        

                      <ListItem
                          key={l.AlertTypeId}
                          roundAvatar
                          style={Styles.listItem}
                          title={
                            <Text style = {this.state.newOpenAlerts.includes(l.AlertID) ? Styles.title : Styles.titleC} numberOfLines={1}>
                              {l.Title}
                            </Text>
                          }
                          subtitle={
                            <Text style={Styles.subtitleView} numberOfLines={2} ellipsizeMode ={'tail'} >
                              {l.PushText}
                            </Text>

                          }
                          avatar={this.getAvatar(l)}
                          containerStyle={{ borderBottomColor : 'white', padding:10,
                           backgroundColor: this.state.newOpenAlerts.includes(l.AlertID) ? 
                           brand.colors.white : brand.colors.newAlert }}
                          onPress={() => this.onPress(l,this.state.req) }

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

