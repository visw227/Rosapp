import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Communications from 'react-native-communications'


import brand from '../../Styles/brand'
import Styles from '../StaffList/Member/Styles'

import AvatarInitials from './AvatarInitials'

class StaffMember extends React.Component {


constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: true,
          requestStatus: {
              hasError: false,
              message: ""
          },
          userToken: '',
          userProfile: null,
          data: []
      }


  }

  getAvatar = (item) => {

    // console.log("getAvatar: ", item.name, item.userId, item.imagePath)

    // make sure that the imagePath is not null that it matches the userId
    // several were different in dev and QA and caused the image to get a 404, messing up the UI
    if(item.imagePath && item.imagePath.indexOf(item.userId) != -1) {
      return (
        <Image 
          key={new Date()} 
          style={Styles.avatar} 
          source={{uri: getHost() + "/image-server/profile-pics/" + item.userId }}
        />
      )
    }
    else {
      return (
          <AvatarInitials
            style={{alignSelf: 'center', marginTop: -75, borderColor: '#ffffff', borderWidth: 1 }}
            backgroundColor={brand.colors.secondary}
            color={'white'}
            size={150}
            fontSize={40}
            text={item.nameOriginal}
            length={2}
          />
      )
    }
  }


  render() {

    
    const member = this.props.member


    return (
      

      <View style={Styles.container}>

          <ScrollView>

          <View style={Styles.header}></View>

          {this.getAvatar(member)}

          <View style={Styles.body}>

            <View style={Styles.bodyContent}>
              
                <Text style={Styles.name}>{member.nameOriginal}</Text>
                {member.sharePhone &&
                <Text style={Styles.info}>{member.phone}</Text>
                }
                {member.shareEmail &&   
                <Text style={Styles.info}>{member.email}</Text>
                }
                
                <View  style={{  marginTop: 20, flexDirection: 'row', alignItems: 'flex-start'}}>
                  {member.sharePhone &&


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

                        onPress={() => Communications.phonecall(member.phone,false) }
                        
                    >
                      <FontAwesome name={"phone"}  size={30}  color={brand.colors.white} />
                      <Text style={{ color: brand.colors.white }}>Call</Text>
                    </TouchableOpacity>

     } 
                  {/* {member.sharePhone &&
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
                        onPress={() => Communications.text(member.phone) }
                    >
                      <Ionicon name={"md-chatbubbles"}  size={30}  color={brand.colors.white} />
                      <Text style={{ color: brand.colors.white }}>Chat</Text>
                    </TouchableOpacity>
       
                  }        */}

                  {member.shareEmail &&     

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
                        marginRight: 0
                        
                      }}
                      onPress={() => Communications.email([member.email], null, null, 'StaffLinQ', 'Sent from StaffLinQ')}
                  >
                    <Entypo name={'email'} size={25} color={brand.colors.white} />
                    <Text style={{ color: brand.colors.white }}>Email</Text>
                  </TouchableOpacity>

                  }
                </View>

            </View>

          </View>

        </ScrollView>

      </View>

    );
  }
}



//make this component available to the app
export default StaffMember;