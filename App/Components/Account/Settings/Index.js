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
import { alertTypes,alertSubscription } from '../../../Services/Account';


import Styles from './Styles'

import { List, ListItem, Avatar } from 'react-native-elements'
import { Switch } from 'react-native-gesture-handler';


let options = [
  {
    group: "Messages",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Available Shifts",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Shift Wanted",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  },
  {
    group: "Work Calendar",
    data: [
      // {
      //   type: "Email Notification",
      //   selected: true
      // },
      {
        type: "Push Notification",
        selected: true
      },
    ]
  }
]

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
          switch1 : true,
          switch2 : false,
          switch3 : false,
          switch4 :true,
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
          }
         
      }

  }


    value = (id,array) => {

      console.log('switch vale',array)
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

    var list = {}
    var optionsman = []

    

    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
      backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    var client = this.props.screenProps.state.selectedClient
    var token = this.props.screenProps.state.userData.token


    // alertTypes (client,token ,function(err,resp) {
    //   if (err){
    //     console.log ('Error siteSettings',err)
    //   }
    //   else {
    //     console.log('response',resp)
    //     var alertTypes = []
    //     var alertyTypeId = []

    //       resp.forEach(element => {
    //         if(element.alert_category.toLowerCase() === 'stafflinq'){
    //           alertTypes.push(element.alert_name)
    //           alertyTypeId.push(element.alert_type_id)
    //         }
    //       });
    //       console.log('modifiedresp',alertTypes)

    //       _this.setState ({
    //         alertOptions : alertTypes,
    //         alerttypeids : alertyTypeId
    //       }, ()=> console.log('AlertState',_this.state.alertOptions))

        
    //   }

    //   })
      


  }

  componentDidUpdate(prevProps, prevState) {
    const {Text} = this.state;
    console.log('<<<Component Did Update is called',prevState)
    if(Text !== prevState.Text){
        console.log('update scrollTop!');
    }
  }

  toggleSwitch = (val) => {

    _this = this  

    if (val === 4){
      _this.setState({
        switch4 : false
      })
    }
    
  }


  render() {
    //alert('render is called')

    console.log('<<state',this.state)
    var optionsList = []
      
     if(this.state.alertOptions.length > 0) {

      for (i=0; i < this.state.alertOptions.length ; i++ ) {
        
        opts = Object.assign(
         {},{  group:this.state.alertOptions[i] ,
                id : this.state.alerttypeids[i],
         data: [
           // {
           //   type: "Email Notification",
           //   selected: true
           // },
           {
             type: "Push Notification",
             id: this.state.alerttypeids[i],
             selected: true
           },
         ]}
        )
        optionsList.push(opts)
       
     }
     
     console.log ('optionsRa',optionsList)
     

     }

     


    return (

      
      <View>
        <Text style={{fontSize:18,textAlign: 'center',fontStyle:'italic',color:brand.colors.primary,margin:10}}> You can Subscribe or Unsubscribe the Notification here</Text>
      

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
                <TouchableHighlight onPress= {()=> this.setState({Text:'Rosnet'})}>
                  <Text style={Styles.sectionHeader}>{this.state.Text}</Text>
                </TouchableHighlight>
                

                <View>
                <View>
                  <View style={Styles.list}>
                    <Text style={{fontSize:20,marginLeft:20}}>Time Off Request</Text>
                    <View style={{alignItems:'flex-end',flex:1}}>
                    <Switch style={{marginRight:10}} value={this.state.switch1}></Switch>
                    </View>
                    
                  </View>
                  <View style ={{borderBottomColor:'#DDDDDD',borderBottomWidth:2}}></View>
                  </View>
                  <View>
                  <View style={Styles.list}>
                    <Text style={{fontSize:20,marginLeft:20}}>Availability change Request</Text>
                    <View style={{alignItems:'flex-end',flex:1}}>
                    <Switch style={{marginRight:10}} value={this.state.switch2}></Switch>
                    </View>
                    
                  </View>
                  <View style ={{borderBottomColor:'#DDDDDD',borderBottomWidth:2}}></View>
                  </View>
                  <View>
                  <View style={Styles.list}>
                    <Text style={{fontSize:20,marginLeft:20}}>Pickup Shift</Text>
                    <View style={{alignItems:'flex-end',flex:1}}>
                    <Switch style={{marginRight:10}} value={this.state.switch3}></Switch>
                    </View>
                    
                  </View>
                  <View style ={{borderBottomColor:'#DDDDDD',borderBottomWidth:2}}></View>
                  </View>
                  <View>
                  <View style={Styles.list}>
                    <Text style={{fontSize:20,marginLeft:20}}>Shift Swap</Text>
                    <View style={{alignItems:'flex-end',flex:1}}>
                    <Switch style={{marginRight:10}} value={this.state.switch4} onValueChange ={()=>this.setState({switch4 : false},()=>console.log('done'))}></Switch>
                    </View>
                    
                  </View>
                  <View style ={{borderBottomColor:'#DDDDDD',borderBottomWidth:2}}></View>
                  </View>
                  
                 
                </View>

                  {/* Section List is being removed for now because the setstate value is setting back to default on navigation */}
                
                {/* <SectionList
                    renderItem={({item, index, section}) => 
                        <ListItem

                            key={item.type + index}
                            style={{ padding:0, marginTop:-10 }}
                            switchButton 
                            switched={_this.value(item.id,optionsList)}
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
                    // renderSectionHeader={({section: {group,id}}) => (
                    //     <Text style={Styles.sectionHeader}>{group}</Text>
                    // )}
                    sections={optionsList}
                    keyExtractor={(item, index) => item.type + index}
                /> */}
                

            </ScrollView>
            </View>


    );
  }
}


//make this component available to the app
export default Settings;