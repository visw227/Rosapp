import React from 'react'

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native'

import { NavigationActions, StackActions } from 'react-navigation'

import { List, ListItem, Avatar } from 'react-native-elements'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../../Styles/brand'
import Styles from './Styles'


class ModuleItems extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({


    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Modules': navigate.navigation.state.params.title,

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

  })


  constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          data: []
      }

  }


  loadMenu = (callback) => {

    const { navigation } = this.props;

    const item = navigation.getParam('item', null );

    // save a copy to local storage in case the user resumes using the app here - after biometrics
    if(item) {

      console.log("saving selectedMenu", item)
      AsyncStorage.setItem('selectedMenu', JSON.stringify(item))

      callback(item)
    }
    else {
      
        console.log("loading selectedMenu..")

        AsyncStorage.getItem('selectedMenu').then((data) => {

            if(data) {

              let selectedMenu = JSON.parse(data)

              console.log("loaded selectedMenu", selectedMenu)

              callback(selectedMenu)


            }

        })
    }


  }

  componentDidMount () {

    let _this = this


    this.loadMenu(function(item){


      _this.props.navigation.setParams({ 
        title: item.name,
        backgroundColor: _this.props.screenProps.state.backgroundColor 
      })


      console.log("item", item)

      let items = []

      if(item.subs && item.subs.length > 0) {

        item.subs.forEach(function(child){

          child.items.forEach(function(c){
            items.push(c)
          })


        })
      }

      console.log("items", JSON.stringify(items, null, 2))

      _this.setState({
        item: item, 
        data: items
      })

    })



  }

  
  onSelect = (item) => {

    console.log("opening ModulesWebView", item)
    this.props.navigation.navigate('ModulesWebView', { item: item, 'AlertScreen' : 'false' })

  }

  render() {

  
    return (

        <View style={styles.container}>

          <ScrollView style={{ backgroundColor: '#ffffff' }}>

            <List style={styles.list}>

                {this.state.data && this.state.data.map((item, index) => (
                    <ListItem

                        key={index}
                        style={styles.listItem}
                        title={item.name}
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View>
                          {item.description.length > 0 &&
                            <View style={styles.subtitleView}>
                                <Text style={styles.ratingText}>{item.description}</Text>
                            </View>
                          }
                          {/* <View style={styles.subtitleView}>
                              <Text style={styles.ratingText}>{item.path}</Text>
                          </View> */}
                        </View>
                        }
                        avatar={<Avatar rounded medium
                            overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                            icon={{name: 'codepen', type: 'font-awesome'}}/>}
                        
                        onPress={() => { this.onSelect(item) }}
                    
                    />
                  ))
                }

            </List>

          </ScrollView>

            {/* // commented out for app store screenshots */}
            {/* <View style={{ marginLeft:300,
                   position: 'absolute',
                  bottom: 20}}>
          
                  <Avatar
                  rounded medium
                  overlayContainerStyle={{backgroundColor: '#1867B2'}}
                  icon={{name: 'search', type: 'font-awesome'}}
                  onPress={()=> 
                    this.props.navigation.navigate('SearchItems')}/>
                
            </View>   */}

        </View>

    ) // end return

  } // end render


} // end class


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginTop: -20
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  list: {
    marginTop: -20,
    paddingTop: 0,
    paddingBottom: 0
  },
  listItem: {
    marginBottom: 10
  },
  ratingText: {
    paddingLeft: 0,
    color: '#808080'
  },
  tile: {
    alignItems: "center",
    backgroundColor: brand.colors.secondary,
    flexGrow: 1,
    flexBasis: 0,
    margin: 2,
    padding: 20
  },
  item: {
    alignItems: "center",
  },
  text: {
    color: 'white',
    fontWeight: 'normal',
  }
});


//make this component available to the app
export default ModuleItems;