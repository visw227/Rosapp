import React from 'react';
import { Text, Image, View } from 'react-native';
import {getBadgeCount} from '../../Services/Push'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import brand from '../../Styles/brand'



class Badge extends React.Component {


 
    constructor(props) {
      super(props);

      this.state = {
         
        newAlertCount :0
          }         
  }
    
  componentDidMount () {


    this.setBadge();

    console.log('peopsss',this.props.screenProps)

    this.interval = setInterval (() => this.setBadge()
        ,15000)


  }

  setBadge = () => {

    _this = this
    
    console.log('set bAdge called')
    
    if(_this.props.screenProps){

        let request = {
            client : _this.props.screenProps.state.selectedClient,
            token : _this.props.screenProps.state.userData.token,
            userName : _this.props.screenProps.state.userData.userName
          }

          getBadgeCount (request,function(err,resp){
            if (err) {
              console.log('Badge count error',err)
            }
            else {
              console.log('Badge count success',resp)
              _this.setState({
                  newAlertCount : resp
              })
            }
          })
    }
   
   

  
  }

  render() {
    

   // below is an example notification icon absolutely positioned 
    return (
     
        
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <FontAwesome name="bell" size={20} color={brand.colors.primary} />


      {
        this.state.newAlertCount && this.state.newAlertCount > 0 ?
        <View style={{ 
            position: 'absolute', 
            paddingLeft: 4, 
            paddingRight: 4,
            right: -17, 
            top: 1, 
            backgroundColor: brand.colors.secondary, 
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