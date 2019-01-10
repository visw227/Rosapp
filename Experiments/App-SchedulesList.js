
import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    Button, 
    SectionList, 
    ScrollView, 
    RefreshControl,
    TouchableOpacity 
} from 'react-native';
import { createStackNavigator, createDrawerNavigator } from 'react-navigation'
import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { List, ListItem, Avatar } from 'react-native-elements'

import AvatarInitials from '../App/Components/ReusableComponents/AvatarInitials'
import ActionButton from '../App/Components/Schedules/ActionButton'


import brand from '../App/Styles/brand'

// hide warnings for now...
console.disableYellowBox = true;

let scheduleData = require('../App/Fixtures/Schedules-v2.2')

class Test extends React.Component {

    static navigationOptions = (navigate) => ({

        title: 'SectionList Demo',

        // these seem to ONLY work here
        headerStyle: {backgroundColor: brand.colors.primary },
        headerTintColor: 'white',
        headerLeft : <Ionicon
            name="md-menu"
            size={35}
            color={brand.colors.white}
            style={{ paddingLeft: 10 }}
            onPress={() => navigate.navigation.toggleDrawer() }
        />,

        drawerLabel: 'Home',
        drawerIcon: ({ tintColor }) => (
        <Image
            source={require('../App/Images/TabBar/calendar-7.png')}
            style={[styles.icon, {tintColor: tintColor}]}
        />
        ),
    })

    constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
      }


  }

    getAvatar = (sched) => {

        let backgroundColor = brand.colors.secondary
        if(sched.type === 'available-shift') {
            backgroundColor = brand.colors.silver
        }
        else if(sched.type === 'available-shift-requested' && sched.typeStatus == 'awaiting-pickup-approval') {
            backgroundColor = brand.colors.silver
        }
        else if(sched.type === 'requested-shift' && sched.typeStatus === 'awaiting-manager-approval') {
            backgroundColor = brand.colors.silver
        }
        else if(sched.swapRequest && sched.swapRequest.type === 'swap-request-received') {
            backgroundColor = brand.colors.silver
        }

        return (
            <AvatarInitials
                style={{alignSelf: 'center', borderColor: '#ffffff', borderWidth: 1 }}
                backgroundColor={backgroundColor}
                color={'white'}
                size={50}
                fontSize={20}
                text={moment(sched.shift_Begin).format('ddd')}
                length={3}
            />
        )

    }



    getDetails = (sched, index, section) => {


        return (
            <View  style={styles.scheduleRow}   key={ 'sr' + sched.sortableTime + '_' + sched.location } >
                
                <View  style={styles.leftColumn}  key={ 'lc' + sched.sortableTime + '_' + sched.location }>
                    {this.getAvatar(sched)}

                    <View  style={styles.timeColumn} key={ 'tc' + sched.sortableTime + '_' + sched.location }>
                        <Text style={styles.timeColumnTime}>{moment(sched.shift_Begin).format('h:mm a')}</Text>
                        <Text style={styles.timeColumnLocation}>{sched.location_Name}</Text>
                        <Text style={styles.timeColumnRole}>{sched.role_Desc}</Text>

                    </View>
                </View>
                


                <View  style={styles.actionButtonsColumn}   key={ 'ac_' + sched.sortableTime + '_' + sched.location }>
                    <ActionButton sched={sched} />
                </View>

            </View>
        )
    }

    render () {
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

                <SectionList
                    renderItem={({item, index, section}) => 

                        this.getDetails(item, index, section)


                    }
                    renderSectionHeader={({section: {date}}) => (
                        <Text style={styles.sectionHeader}>{moment(date).format('dddd, MMM Do')}</Text>
                    )}
                    sections={scheduleData}
                    keyExtractor={(item, index) => item.sched_Rec_ID + 'abc' + index}
                />

            </ScrollView>
        )
    }

}


styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 15,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 5,
    backgroundColor: brand.colors.secondary,
    // color: brand.colors.white,
    fontStyle: 'italic'
  },
  scheduleRow: {
    justifyContent: 'space-between',
    flexDirection: 'row', 
    alignItems: 'flex-start', 
    marginLeft: 5, 
    marginTop: 5, 
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    
  },
  leftColumn: {
    flexDirection: 'row', 
    alignItems: 'flex-start', 
  },
  middleColumn: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0
  },
  middleColumnTitle: {
    fontSize: 12,
    fontStyle: 'italic',
    // color: brand.colors.gray
  },
  middleColumnInfo: {
    fontSize: 10,
    fontStyle: 'italic',
    color: brand.colors.gray
  },
  listItem: {
    paddingLeft: 5,
    marginTop: 10,
    marginBottom: 10
  },
  itemImage: {
    marginLeft: 2,
    width: 48,
    height: 48,
    borderRadius: 48/2,
    borderWidth: 0.9,
    borderColor: brand.colors.gray,
  },
  timeColumn: {
    flexDirection: 'column',
    paddingLeft: 5,
    marginTop: 0,
    marginBottom: 0
  },
  timeColumnTime: {
    fontSize: 18
  },
  timeColumnRole: {
    fontSize: 14
  },
  timeColumnLocation: {
    fontSize: 14
  },
  actionRow: {
    justifyContent: 'flex-start',
    flexDirection: 'row', 
    alignItems: 'flex-start',     
  },
  actionColumn: {
    paddingRight: 10,
    flexWrap: 'wrap',
    alignItems: 'flex-end'
  },
  actionButtonsColumn: {
    flexDirection: 'column',
    paddingLeft: 5,
    marginTop: 0,
    marginBottom: 0
    
  },
  actionButton: {
    //position: 'absolute', right: 0
    
  },


})

let ScreenStack = createStackNavigator({ Test })

export default ScreenStack