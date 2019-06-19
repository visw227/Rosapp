import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  ScrollView,
  RefreshControl,
  SectionList,
  TouchableHighlight
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'
import { alertTypes,alertSubscription,retrieveSubscription,backfillSubscription} from '../../../Services/Account';


import Styles from './Styles'

import { List, ListItem, Avatar } from 'react-native-elements'
//import { Switch } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase'
import Push from 'appcenter-push'


class Settings extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Notification Settings',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white'
  })

    constructor(props) {
      super(props);


      // const pushEnabled = async () => {
      //   const enabled = await Push.isEnabled()

      //   console.log('enabled 1:', enabled);

      //   let isEnabled = enabled
      // }

      // console.log("pushEnabled 2", pushEnabled)


      this.state = {
          sending: false,
          receiving: false,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userToken: '',
          value: false,
          userProfile: null,
          alertOptions : [],
          alerttypeids: [],
          Text : 'Stafflinq',
          options : [],
          alertTypeID : null,
          desc:null,
          push:null,
          request : {
            
            userName: this.props.screenProps.state.userData.userName,
            client: this.props.screenProps.state.selectedClient ,
            token :  this.props.screenProps.state.userData.token,
            alertTypeID : null ,
            desc : null ,
            email : 1,
            push : null
          },
          pushEnabled: false
         
      }

  }


    checkSettings = () => {

      let _this = this

      this.pushIsEnabled(function(isEnabled){
        console.log("isEnabled", isEnabled)

        _this.setState({
          pushEnabled: isEnabled
        })

      })

    }

    pushIsEnabled = async (callback) => {
      // do something
      const enabled = await firebase.messaging().hasPermission()

      console.log("enabled", enabled)

      callback(enabled)

    }


    value = (id,array) => {

      // console.log('switch vale',array)
      // console.log ('<<<Value method switch values',this.state.switch1,this.state.switch2,this.state.switch3,this.state.switch4)
      if (id === 1){
        return this.state.switch1
      }
      else if (id === 2){
        return this.state.switch2
      }

      else if (id === 3) {
        return this.state.switch3
      }

      else if (id === 4) {
        return this.state.switch4
      }

    }


  componentDidMount () {
    _this = this

    
    this.props.navigation.addListener('willFocus', this.checkSettings)


    console.log("state", this.state)

    this.props.navigation.setParams({ 
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    var client = this.props.screenProps.state.selectedClient
    var token = this.props.screenProps.state.userData.token

    var request = {
      client : client,
      token:token,
      userName : this.props.screenProps.state.userData.userName
    }

// This is an api call -- we are retrieving the subscription values of the use and if there is not entry in the subscription table,
// we will call backfillSubscription api, which will make the Notify_by_push field true for all the alertTypes of the user
    
    retrieveSubscription(request,function(err,resp){
      console.log("api response",resp,resp.length)
      if (err){
        console.log(err)
      }
      else   {
        resp.forEach(element => {
          if(element.Alert_type_ID === 1 ){
            _this.setState({
              switch1: element.Notify_by_Push === 1 ? true : false
            })
          }
          if(element.Alert_type_ID === 2 ){
            _this.setState({
              switch2: element.Notify_by_Push ===1 ? true : false
            })
          }
          if(element.Alert_type_ID === 3 ){
            _this.setState({
              switch3: element.Notify_by_Push ===1 ? true : false
            })
          }
          if(element.Alert_type_ID === 4 ){
            _this.setState({
              switch4: element.Notify_by_Push ===1 ? true : false
            })
          }
          
        });
       //console.log(resp)
      }
    })

// Calling api to return the list of alerts

    alertTypes (client,token ,function(err,resp) {
      if (err){
        console.log ('Error siteSettings',err)
      }
      else {
        console.log('response',resp)
        var alertTypes = []
        var alertyTypeId = []

          resp.forEach(element => {
            if(element.alert_category.toLowerCase() === 'stafflinq'){
              alertTypes.push(element.alert_name)
              alertyTypeId.push(element.alert_type_id)
            }
          });
          console.log('modifiedresp',alertTypes)

          _this.setState ({
            alertOptions : alertTypes,
            alerttypeids : alertyTypeId
          }, ()=> console.log('AlertState',_this.state.alertOptions))

        
      }

      })
      


  }




  render() {
    
    //console.log('<<state',this.state)
    var optionsList = []
      
    if(this.state.alertOptions.length > 0) {
      // Returing an array object suitable for List / section list
      for (i=0; i < this.state.alertOptions.length ; i++ ) {
        opts = Object.assign(
         {},{  group:this.state.alertOptions[i] ,
                id : this.state.alerttypeids[i],
         data: [
           {
             type: this.state.alertOptions[i],
             id: this.state.alerttypeids[i],
             selected: true
           },
         ]}
        )
        optionsList.push(opts) 
     }
    }

    
    if(this.state.pushEnabled === false) {

      return (
        <View>
            <Text style={{ 
              color: brand.colors.primary,
              justifyContent: 'center', 
              alignItems: 'center',
              textAlign: 'center',
              margin: 15
            }}>Please update your device settings to allow notifications for Rosnet.</Text>
        </View>
      )

     }
     else if (this.props.screenProps.state.userData && this.props.screenProps.state.userData.userLevel === 1)  {

      return (

      
        <View>
          <View style = {{backgroundColor: brand.colors.lightGray}}>

          <Text style={{fontSize:20,textAlign: 'left',fontStyle:'italic',color:brand.colors.primary,margin:10,marginBottom:3}}> 
          Let us notify you
          </Text>
          <Text style={{fontSize:15,textAlign: 'left',fontStyle:'italic',color:brand.colors.primary,margin:10,marginTop:0}}> 
          Get regular alerts about:
          </Text>

          </View>
         
  
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
                  
                    <Text style={Styles.sectionHeader}>{'StaffLinQ Notifications'}</Text>
              
                  
                   <SectionList
                      renderItem={({item, index, section}) => 
                          <ListItem
                              key={item.type + index}
                              style={{ padding:0, marginTop:-10 }}
                              switchButton 
                              switched={this.value(item.id,optionsList)}
                              //onValueChange ={alert('change')}
                              hideChevron
                              title={item.type}
                              //onSwitch={(value)=>console.log('switch',value)}
                              onSwitch={(value) => {
                                this.setState(previousState => {
                                  if(item.id === 1){
                                    return {...previousState,switch1: value ,request:{...this.state.request,desc :'time off',push: value ? 1 : 0, alertTypeID:1}}
                                  }
                                  if (item.id === 2){
                                    return {...previousState,switch2: value,request:{...this.state.request,desc :'Availability change req',push: value ? 1 :0, alertTypeID:2}}
                                  }
                                  if (item.id === 3){
                                    return {...previousState,switch3: value,request:{...this.state.request,desc :'Pick up shift',push: value ? 1 :0, alertTypeID:3}}
                                  }
                                  if (item.id === 4){
                                    return {...previousState,switch4: value,request:{...this.state.request,desc :'Shift Swap',push: value ? 1 :0, alertTypeID:4}}
                                  }
                                },()=>
                                alertSubscription(this.state.request,function(err,resp){
                                    if (err){
                                      console.log('error')
                                    }
                                    else {
                                      console.log(resp)
                                    }
                                }
                                )
                                )
                              }
  
                            }
  
                          />
                      }
                      // [Note :] Header is not needed for now--
                      // renderSectionHeader={({section: {group,id}}) => (
                      //     <Text style={Styles.sectionHeader}>{group}</Text>
                      // )}
                      sections={optionsList}
                      keyExtractor={(item, index) => item.type + index}
                  /> 
                  
  
              </ScrollView>
              </View>
  
  
      ) 

     }

     else return <View>

     </View>

    
  }
}


//make this component available to the app
export default Settings;