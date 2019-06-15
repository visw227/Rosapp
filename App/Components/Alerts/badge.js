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
      newAlertCount : 0,
      color : brand.colors.primary
    }       

  }
    
  componentDidMount (props) {

    this.setBadge();

    this.interval = setInterval (() => this.setBadge(), 60000)

    console.log('props',this.props)
    
  }



  setBadge = () => {

    _this = this
    
    //console.log('set bAdge called',_this.state.newAlertCount)
    
    if(this.props.screenProps){

      let request = {
        client : this.props.screenProps.state.selectedClient,
        token : this.props.screenProps.state.userData.token,
        userName : this.props.screenProps.state.userData.userName
      }

      getBadgeCount (request,function(err,resp){
        //console.log('props',this.props)
        //console.log("Resp : : State",resp,  + _this.state.newAlertCount)
        if (err) {
          //console.log('Badge count error',err)
      
        }
        else {

          if (_this.state && _this.state.newAlertCount && resp > _this.state.newAlertCount) {
            _this.displayNotification()
          }

          _this.state && _this.setState({
              newAlertCount : resp
          })

        }

      }) // end getBadgeCount


    } // end if screenProps
   
   

  
  }

  displayNotification = () => {

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

        console.log ('Error siteSettings',err )
      }

      else {
        console.log('response!!!',resp)
        
        var data = resp.reverse()

        console.log('badge :',data)
        
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
        .setBody(data[0].PushText);


        //Sending notifications on app foreground state is not being implemented for now
          
        // if (data[0].pushNeed !== false) {
        //   firebase.notifications().displayNotification(notification)
        // }
 
        
      }

    })
   



  }

  render() {
    

   // below is an example notification icon absolutely positioned 
    return (
     
        
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>

        

        <FontAwesome name="bell" size={20} color={this.props.color} />
       
        {
          this.state && this.state.newAlertCount && this.state.newAlertCount !== 0 ?
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