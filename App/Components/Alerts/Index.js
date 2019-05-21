

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
  TouchableHighlight,
  FlatList
} from 'react-native';

import moment from 'moment'

import { List, ListItem, Avatar, CheckBox} from 'react-native-elements'

import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

import brand from '../../Styles/brand'
import Styles from './Styles'

import AvatarInitials from '../ReusableComponents/AvatarInitials'
import LocationButtons from '../ReusableComponents/LocationButtons';
import { GetNotifications,getOpenedAlertsCount,updateOpenAlertsCount,hideAlert} from '../../Services/Push';
import AlertMessage from '../Modules/AlertMessage';


import Swipeout from 'react-native-swipeout'


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

      headerRight : navigate.navigation.getParam('renderStyle')

      //headerRight : typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.delState) === 'undefined' ? <Text>undefined</Text>: <Text>{navigate.navigation.state.params.delState}</Text>

     

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
          delList :[],
          title : null,
          deleteState : this.props.screenProps.state.deleteState,
          text : null,
          selectAll : true,
          loading: true,
          alertOn : true,
          alertMessage : 'Alerts are Loading...',
          headerRightTxt : 'Select',
          req : {
            client : this.props.screenProps.state.selectedClient,
            token : this.props.screenProps.state.userData.token,
            userName : this.props.screenProps.state.userData.userName,
            
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

      else if (resp.length < 1) {
        //console.log('Alert message is logged')
        _this.setState({alertMessage : 'No Alerts to Display at this time'})
      }

      else {
        console.log('response',resp)

          _this.setState ({
            alertOn : false,
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


    this.props.navigation.addListener('willFocus', this.load)


          
      // NOtifications are initially rendered when component is mounted
    this.renderNotification()

    this._getOpenAlertsCount(this.state.req)

    // setTimeout(()=> {
    //   if(this.state.data.length < 1 || !this.state.data) {
    //     this.setState ({
    //       alertMessage : 'No Alerts to Display at this time'
    //     })
    //   }
    // },20000)

    let _this = this 

  

  

      _this._getOpenAlertsCount(_this.state.req)

      // This call the api for every 15secs to render new added notifications
      // _this.interval = setInterval (() => _this.renderNotification()
      // ,15000)

      _this.interval = setInterval (() => _this._getOpenAlertsCount(_this.state.req)
      ,15000)

      
      this.props.navigation.setParams({ 
        backgroundColor:_this.props.screenProps.state.backgroundColor
        
      },() => console.log('viswa',this.props.navigation.state.params))

     
  }

  load = () => {

    _this = this 

    _this.renderNotification()
    _this._getOpenAlertsCount(_this.state.req)
    this.props.navigation.setParams({renderStyle : this.renderStyle()})


  }

  renderStyle = () => {

    console.log('Rener Style :', this.state.deleteState)
   
    if(this.state.deleteState){

      return(
      
        <Text style ={{color:brand.colors.white,paddingRight:10}} onPress={()=>this.setState({
          deleteState : false,
          headerRightTxt : 'Select',
          delList : [],
          selectAll : true
        },()=>this.props.navigation.setParams({renderStyle : this.renderStyle()}))}> {this.state.headerRightTxt} </Text> 

     )

    } return (
     
              
      <Text style ={{color:brand.colors.white,paddingRight:10}} onPress={()=>this.setState({
        deleteState : true,
        headerRightTxt : 'Cancel',
        delList : [],
        selectAll : true
      },()=>this.props.navigation.setParams({renderStyle : this.renderStyle()}))}> {this.state.headerRightTxt} </Text> 

     
    )
   

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
       // console.log('get alert count error',err)
      }

      else {
       // console.log('get alert count success',resp)

        var buffer = []

        resp.forEach(e => {
          buffer.push(e.Alert_ID)
        })
        _this.setState({
          newOpenAlerts : buffer
        }, ()=> {
          //console.log('get alert :',_this.state.newOpenAlerts)
        })
      }

    })
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
  getDelAvatar = (l) => {

    //_this = this

   if(this.state.delList && this.state.delList.includes(l.AlertID)) return (
     console.log("hellooooo.....avatar"),
      <View
          style={{
              //borderWidth:1,
              //borderColor: brand.colors.secondary,
              alignItems:'center',
              justifyContent:'center',
              width:40,
              height:40,
              //backgroundColor: brand.colors.secondary,
              borderRadius:100,
              marginRight: 0
            }}
        >
          <Ionicon name={'md-radio-button-on'} size={22} color={brand.colors.primary} />
        </View>
    )
    else return (
      <View
      style={{
          //borderWidth:1,
          //borderColor: brand.colors.secondary,
          alignItems:'center',
          justifyContent:'center',
          width:40,
          height:40,
          //backgroundColor: brand.colors.secondary,
          borderRadius:100,
          marginRight: 0
        }}
    >
      <Entypo name={'circle'} size={22} color={brand.colors.primary} />
    </View>
    )

  }



  deleteAlert = (alertId) => {

    _this = this

    hideAlert(_this.state.req,alertId,function(err,resp){
      if (err) {
        console.log ('Delete Alert Error',err)
      }
      else {
        console.log('Delete Alert Success',resp)
      }
    })



  }

  swipeDelete = (listItem) => {

    _this = this

    console.log('Pre pop array',_this.state.data.length)

      var oldData = []
      _this.state.data.forEach(e => {
        if(e.AlertID === listItem.AlertID) {

         _this.deleteAlert(listItem.AlertID)

          _this.state.data.pop(e)
          _this.setState({
           data : _this.state.data
          }) 

          console.log('Array after pop',_this.state.data.length)
        }
      })

  }

  deleteItem = () => {

    _this = this


    const result = (_this.state.data).filter(e => _this.state.delList.indexOf(e.AlertID) == -1 )

    _this.setState({
      data : result,
      delList :[],
      deleteState: false,
      selectAll : true
    })
    

    _this.state.delList.forEach(e => {

      _this.deleteAlert(e)

    })

  }


  selectAll = () => {

    var buffer = []
    this.state.data.forEach(e => {
      
      buffer.push(e.AlertID)
    })

    this.setState({
      delList : buffer,
      selectAll : false
    })


  }


  selectItem = (listItem) => {

    if(this.state.delList && this.state.delList.indexOf(listItem.AlertID) == -1){

    var buffer = this.state.delList

    buffer.push(listItem.AlertID)

    this.setState ({
      delList : buffer
    })
  }

    else{

      this.state.delList.pop(listItem.AlertID)

      this.setState ({
        delList : this.state.delList
      })


    }

    this.getDelAvatar(listItem)

  }

    

    

  render() {

    
  //data is now reversed in setState method itself
    return (

      
          <View style={{flex :1}}>

        
           {this.state.alertOn && <AlertMessage title={this.state.alertMessage}/> }

           

          <ScrollView
            style={{ backgroundColor: '#ffffff' }}
            refreshControl={

              <RefreshControl
                refreshing={this.state.receiving}
                onRefresh={this.renderNotification}
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

                      
                       swipeBtns = [{
                        text: 'Delete',
                        backgroundColor: 'red',
                        //underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
                        onPress: () => { this.swipeDelete(l) }
                      }] ,
                    
                      

                      <View style={{flexDirection : 'column'}}>

                      <Swipeout right={swipeBtns}>
                     
                      {this.state.deleteState === false ?  <ListItem
                          key={l.AlertTypeId}
                          
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
                           backgroundColor: this.state.newOpenAlerts.includes(l.AlertID)  || l.AlertOpened ?
                           brand.colors.white : brand.colors.newAlert }}
  
                          onPress={() => this.onPress(l,this.state.req) }

                      />   :
                       <ListItem
                              key={l.AlertTypeId}
                              
                              style={Styles.listItem}
                              title={
                                <Text style = {this.state.delList && this.state.delList.includes(l.AlertID) ? Styles.title : Styles.titleC} numberOfLines={1}>
                                  {l.Title}
                                </Text>
                              }
                              subtitle={
                                <Text style={Styles.subtitleView} numberOfLines={2} ellipsizeMode ={'tail'} >
                                  {l.PushText}
                                </Text>

                              }
                              avatar={this.getDelAvatar(l)}
                              containerStyle={{ borderBottomColor : 'white', padding:10,
                              backgroundColor: this.state.delList && this.state.delList.includes(l.AlertID) ? 
                              brand.colors.lightGray : brand.colors.white }}

                              onPress={() => this.selectItem(l) }

                          />  }   

                      </Swipeout>

                      </View>
                    
                     

                    ))
                  }

                </List>
              }
              </View>

          
           
          </ScrollView>

          <View style={{ marginLeft:300,
                   position: 'absolute',
                  bottom: 20}}>
              { !this.state.deleteState ? 
              

                 null

         : 
        
         <View>
        
        {this.state.selectAll && <View
              style={{
                  borderWidth:1,
                  borderColor: brand.colors.primary,
                  alignItems:'center',
                  justifyContent:'center',
                  width:40,
                  height:40,
                  backgroundColor: brand.colors.primary,
                  borderRadius:100,
                 
                }}
            >
              <MaterialCommunityIcons name={'check-all'} size={32} color={brand.colors.white} onPress = {()=>{this.selectAll()}} />
            </View>}

         {/* <MaterialCommunityIcons name = {'check-all'} size={32}/> */}
        
        <View style ={{margin : 8}}>
        </View>

         <Avatar
         rounded medium
         overlayContainerStyle={{backgroundColor: brand.colors.primary}}
         icon={{name: 'trash-o', type: 'font-awesome'}}
         onPress = {()=>{this.deleteItem()}}/>

         </View>

               }
       
              </View>

        
          </View>

    );
  }
}


//make this component available to the app
export default AlertsScreen;

