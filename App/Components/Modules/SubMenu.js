import React from 'react'

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native'

import { List, ListItem, Avatar } from 'react-native-elements'

import { NavigationActions, StackActions } from 'react-navigation'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../../Styles/brand'
import Styles from './Styles'


class SubMenu extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Modules': navigate.navigation.state.params.title,


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


  })


  constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          data: []
      }




  }

  componentDidMount () {

    if (this.state.receiving) {
      return (
        <Text>Loading...</Text>
      )
    }

    let _this = this

    const { navigation } = this.props;
    
    const item = this.props.navigation.getParam('item', { } );

    console.log("ModulesSubMenu item", JSON.stringify(item, null, 2))

    this.props.navigation.setParams({ title: item.name })

    this.setState({
      item: item, 
      data: item.subs
    })


  }

  onSelect = (item) => {

    console.log("selected", item)

    this.props.navigation.navigate('ModulesItems', { item: item })

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
                            

                        avatar={<Avatar rounded medium
                            overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                            icon={{name: 'codepen', type: 'font-awesome'}}/>}
                        
                        onPress={() => { this.onSelect(item) }}
                    
                    />
                  ))
                }

            </List>

          </ScrollView>

           <View style={{ marginLeft:300,
                   position: 'absolute',
                  bottom: 20}}>
          
                  <Avatar
                  rounded medium
                  overlayContainerStyle={{backgroundColor: '#1867B2'}}
                  icon={{name: 'search', type: 'font-awesome'}}
                  onPress={()=> 
                    this.props.navigation.navigate('SearchItems')}/>
                
            </View> 

        </View>

    ) // end return

  } // end render
  
}


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
export default SubMenu;