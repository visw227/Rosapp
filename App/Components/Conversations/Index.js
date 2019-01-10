import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicon from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import brand from '../../Styles/brand'
import Styles from './Styles'

export class Conversations extends React.Component {



    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Conversations',

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
            onPress={() => navigate.navigation.navigate('CreateConversation') }
        />

      </View>,
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

      }


  }

  onSelect = (item) => {

    this.props.navigation.navigate('Conversation', { item: item })

  }


  render() {
        return (

            <View style={Styles.container}>

              <List style={Styles.list}>


                  <ListItem

                      style={Styles.listItem}
                      title='John, Paul, George, Ringo'
                          titleStyle={{ color: brand.colors.gray, fontWeight: 'bold' }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Some say that I'm a dreamer...</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'ios-chatbubbles', type: 'ionicon'}}/>}
                      
                      onPress={() => { this.onSelect({ name: 'John, Paul, George, Ringo' }) }}
                  
                  />
                  
                  <ListItem
                      roundAvatar
                      style={Styles.listItem}
                      title='John, Sally, +25 more...'
                          titleStyle={{ color: brand.colors.gray, fontWeight: 'bold' }}
                          
                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>This is a conversation with multiple people...</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium 
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'ios-chatbubbles', type: 'ionicon'}}/>}

                      onPress={() => { this.onSelect({ name: 'John, Sally, +25 more...' }) }}

                  />

                  <ListItem

                      style={Styles.listItem}
                      title='James Smith'
                          titleStyle={{ color: brand.colors.gray, fontWeight: 'bold' }}

                      subtitle={
                      <View style={Styles.subtitleView}>
                          <Text style={Styles.ratingText}>Did you get my StaffLinQ time off request?</Text>
                      </View>
                      }
                      avatar={<Avatar rounded medium
                          overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                          icon={{name: 'ios-chatbubbles', type: 'ionicon'}}/>}
                      
                      onPress={() => { this.onSelect({ name: 'James Smith' }) }}
                  
                  />



              </List>

            </View>
        )
  }
}

//make this component available to the app
export default Conversations;