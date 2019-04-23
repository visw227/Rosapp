
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


import { getRequests } from '../../../Services/Support'

class SupportView extends React.Component {

  static navigationOptions = (navigate) => ({

    title: 'Support Requests',

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
            onPress={() => navigate.navigation.navigate('SupportRequest') }
        />

      </View>,


    // The drawerLabel is defined in DrawerContainer.js
    // drawerLabel: 'Staff List',
    // drawerIcon: ({ tintColor }) => (
    //   <Image
    //     source={require('../Images/TabBar/list-simple-star-7.png')}
    //     style={[Styles.icon, {tintColor: tintColor}]}
    //   />
    // ),
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
          data: []
      }


  }


  componentDidMount () {
    let userData = this.props.screenProps.state.userData

    this.props.navigation.setParams({ 
        title: this.props.screenProps.state.selectedClient,
        backgroundColor:this.props.screenProps.state.backgroundColor 
    })

    this.loadData()

  }


  loadData = () => {

    let _this = this

    console.log("getting requests for ", this.props.screenProps.state.userData.email)

    getRequests(this.props.screenProps.state.selectedClient, this.props.screenProps.state.userData.token, this.props.screenProps.state.userData.email, function(err, resp){

        if(err) {

            let message = "Sorry, we weren't able to retrieve your support requests."

            if(err.message.indexOf("401") !== -1) {
                message = "Sorry, we need to add you to our support system."
            }

            _this.setState({
                receiving: false,
                requestStatus: {
                    hasError: true,
                    message: message
                },
                data: []
            })
        }
        else {
            _this.setState({
                receiving: false,
                data: resp
            })
        }


    })

  }

  getAvatar = (item) => {

      if(item.status === "closed")
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
              <Entypo name={'support'} size={22} color={brand.colors.white} />
            </View>
        )
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


              {this.state.requestStatus.hasError &&
                <View style={{ 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    marginBottom: 15,
                    marginTop: 10,
                    marginLeft: 10,
                    marginRight: 10,
                    padding: 10
                }}>
                    <Text>{this.state.requestStatus.message}</Text>
                </View>
              }

            <View style={{ marginTop: -20 }} >


              {!this.state.receiving && !this.state.requestStatus.hasError && 

                <List style={Styles.list}>


                  {
                    this.state.data && this.state.data.requests && this.state.data.requests.map((l, i) => (


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
              }
              </View>
           
          </ScrollView>

    );
  }
}


//make this component available to the app
export default SupportView;