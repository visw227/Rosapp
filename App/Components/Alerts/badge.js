import React from 'react';
import { Text, Image, View } from 'react-native';
import {getBadgeCount,GetNotifications} from '../../Services/Push'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import brand from '../../Styles/brand'
import firebase, { RNFirebase } from 'react-native-firebase'



class Badge extends React.Component {


 
    constructor(props) {
      super(props);

      this.state = {
        
        newAlertCount : 0
          }         
  }
    
  componentDidMount () {
    this.setBadge();


    this.interval = setInterval (() => this.setBadge()
<<<<<<< HEAD
        ,15000)
    
=======
        ,60000)
>>>>>>> f139e0786eb71e160522a3605e00fff3fe74674a
  }



  setBadge = () => {

    _this = this
    
    //console.log('set bAdge called',_this.state.newAlertCount)
    
    if(_this.props.screenProps){

        let request = {
            client : _this.props.screenProps.state.selectedClient,
            token : _this.props.screenProps.state.userData.token,
            userName : _this.props.screenProps.state.userData.userName
          }

          getBadgeCount (request,function(err,resp){
            console.log("Resp : : State",resp,  + _this.state.newAlertCount)
            if (err) {
              //console.log('Badge count error',err)
          
            }
            else {

        if (_this.state.newAlertCount && resp > _this.state.newAlertCount) {


          _this.displayNotification()
        
      
              }

              _this.setState({
                  newAlertCount : resp
              })
            }
          })
    }
   
   

  
  }

  displayNotification = () => {

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
        
        var data = resp.reverse()

        console.log('eraaa',data)
        
        const channel = new firebase.notifications.Android.Channel(
          'default_notification_channel_id',
          'aa',
          firebase.notifications.Android.Importance.Max,
          );
          channel.setDescription('aa');
          channel.enableLights(true);
          channel.enableVibration(true);
          firebase.notifications().android.createChannel(channel);

        const notification = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('New Notification')
        .setSound(data[0].Title)
        .setBody(data[0].PushText)
        .setData({
          client: 'value1'
        });
 
        firebase.notifications().displayNotification(notification)
      }

    })
   



  }

  render() {
    

   // below is an example notification icon absolutely positioned 
    return (
     
        
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <FontAwesome name="bell" size={20} color={brand.colors.primary} />

 

      {
        this.state.newAlertCount && this.state.newAlertCount !== 0 ?
        <View style={{ 
            position: 'absolute', 
            paddingLeft: 4, 
            paddingRight: 4,
            right: -17, 
            top: 1, 
            backgroundColor: brand.colors.orange, 
            borderRadius: 10, 
            height: 20, 
            //width: 20, // DONT set this - let it by dynamic - use minWidth to keep it round if just 1 digit
            minWidth: 20, // this keeps it round with borderRadius=10
            justifyContent: 'center', 
            alignItems: 'center' }}><Text style={{ fontSize: 12, fontWeight: 'bold', color: 'white' }}>{this.state.newAlertCount}</Text></View>
            :
            null
        }
 

      </View>
    );
}

}

export default Badge;