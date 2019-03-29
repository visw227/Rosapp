import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';

import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

import Styles from '../Styles'



class LoggedEventDetails extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Event Details',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

  constructor(props) {
    super(props);

  

    this.state = {
        receiving: false,
        logData: []
    }

  }



  render() {

    const { navigation } = this.props;
    const logEvent = navigation.getParam('logEvent', {} );

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


                <List style={Styles.list}>


                    <ListItem

                        hideChevron={true}
                        style={Styles.listItem}
                        title='Source'
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View style={Styles.subtitleView}>
                            <Text style={Styles.ratingText}>{logEvent.source}</Text>
                        </View>
                        }
              
                        

                    
                    />
                    

                    <ListItem

                        hideChevron={true}
                        style={Styles.listItem}
                        title='Title'
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View style={Styles.subtitleView}>
                            <Text style={Styles.ratingText}>{logEvent.title}</Text>
                        </View>
                        }
    
                        

                    
                    />


                    <ListItem

                        hideChevron={true}
                        style={Styles.listItem}
                        title='Message'
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View style={Styles.subtitleView}>
                            <Text style={Styles.ratingText}>{JSON.stringify(logEvent.message, null, 3)}</Text>
                        </View>
                        }
          
                        

                    
                    />



                </List>

              </ScrollView>

            </View>

    );

  }
}


//make this component available to the app
export default LoggedEventDetails;