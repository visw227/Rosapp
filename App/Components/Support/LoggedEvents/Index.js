import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl
} from 'react-native';
import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import moment from 'moment'

import brand from '../../../Styles/brand'

import Styles from '../Styles'

import DeviceInfo from 'react-native-device-info'

import { Logger } from '../../../Helpers/Logger';
import { dynamicSort } from '../../../Helpers/DynamicSort';

class LoggedEvents extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Logged Events',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


    headerRight : 
      <View style={{
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 10,
        width: '100%'
      }}>
        <Text 
          style={{ color: 'white', fontSize: 16 }}
          onPress={navigate.navigation.getParam('handleSubmit')} >
          Delete All
          </Text>
      </View>,


  })

  constructor(props) {
    super(props);

    
    let deviceId = DeviceInfo.getUniqueID()
    let version = DeviceInfo.getVersion()
    let build = DeviceInfo.getBuildNumber()

    this.state = {
        receiving: true,
        logData: []
    }

  }


  componentDidMount() {

    this.loadData()

    this.props.navigation.setParams({ handleSubmit: this.handleSubmit })


  }

  loadData = () => {

    let _this = this

    this.setState({
      receiving: true
    })

    Logger.GetEvents(function(logData){

        // sort list in decending order (newest first)
        logData.sort(dynamicSort('ts', -1)) 

        console.log("logData", JSON.stringify(logData, null, 2))

        _this.setState({
            receiving: false,
            logData: logData
        })

    })

  }

  handleSubmit = () => {

    console.log("handleSubmit...")
    Logger.DeleteAllEvents()
    this.setState({
      logData: []
    })

  }


  render() {

    return (
            <View style={Styles.container}>

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

                {this.state.receiving === false &&
                <List style={Styles.list}>


                  {this.state.logData.map((item, index) => (

                      <ListItem

                          key={'item_' + index}
                          hideChevron={false}
                          style={Styles.listItem}
                          title={item.source}
                          titleStyle={{ fontSize: 16, color: brand.colors.gray }}
                              

                          subtitle={
                          <View style={{ alignItems: 'flex-start', marginLeft: 10 }}>
                              <Text style={Styles.subtitleText}>{item.title}</Text>
                              <Text style={Styles.subtitleText}>{moment(item.ts).format('dddd, MMM Do')} @ {moment(item.ts).format('h:mm:ss A')}</Text>
                          </View>
                          }
                          avatar={

                            <Avatar rounded medium
                              overlayContainerStyle={{ backgroundColor: (item.ok ? brand.colors.green : brand.colors.orange ) }}
                              icon={{name: (item.ok ? 'check' : 'warning'), type: 'font-awesome'}}/>
                          
                          }
                          
                          onPress={() => this.props.navigation.navigate('LoggedEventDetails', { logEvent: item }) }

                      
                      />

                  ))}
                    






                </List>
                }

              </ScrollView>

            </View>
    );

  }
  
}



//make this component available to the app
export default LoggedEvents;