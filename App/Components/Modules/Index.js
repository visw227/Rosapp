import React from 'react'

import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView, AsyncStorage } from 'react-native'

import { NavigationActions, StackActions } from 'react-navigation'

import { List, ListItem, Avatar, Overlay } from 'react-native-elements'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation'
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../../Styles/brand'
import Styles from './Styles'


import { getMobileMenuItems, getTopMenu, getModuleItemsByIdList } from '../../APIs/Modules';

import { getFavorites, saveFavorite, emptyFavorites } from '../../Lib/Favorites';


export class ModulesScreen extends React.Component {


    // MUST BE PRESENT or NO title will appear
  static navigationOptions = (navigate) => ({

    title: 'Rosnet Modules',

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

        <Foundation
            name={typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.viewIcon) === 'undefined' ? 'results': navigate.navigation.state.params.viewIcon}
            size={20}
            color={brand.colors.white}
            style={{ marginRight: 10 }}
            onPress={ navigate.navigation.getParam('toggleView') }
        />

        <FontAwesome
            name={typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.starIcon) === 'undefined' ? 'star-o': navigate.navigation.state.params.starIcon}
            size={20}
            color={brand.colors.white}
            style={{ marginRight: 10 }}
            onPress={ navigate.navigation.getParam('toggleFavorite') } 
        />

      </View>

  })


  constructor(props) {
      super(props);

      this.state = {
          sending: false,
          receiving: false,
          data: [],
          favorites: [],
          showGrid: false,
          showFavorites: false
      }


  }

  componentDidMount () {

    let _this = this

    this.props.navigation.setParams({ toggleView: this.toggleView });

    //this.props.navigation('ModulesSubMenu')

    this.props.navigation.setParams({ viewIcon: 'thumbnails' })

    this.props.navigation.setParams({ starIcon: 'star-o' })

    this.props.navigation.setParams({ toggleFavorite: this.toggleFavorite });
    
    this.props.navigation.setParams({toggleSearch : this.toggleSearch})

    getTopMenu('', function(err, data){

      _this.setState({
          data: data
      })

    })


    // get userData from local storage
    // AsyncStorage.getItem('userData').then((data) => {

    //   let userData = JSON.parse(data)

    //   let cookies = "rememberme=" + userData.userName + "; clientCode=" + userData.selectedSite + "; rosnetToken=" + userData.token 

    //   getMobileMenuItems(cookies, function(err, data){

    //     console.log("getMobileMenuItems data", data)
        
    //     _this.setState({
    //       data: data
    //     })

    //   })


    // })

  }


  swapViewIcon = () => {
    if(this.state.showGrid) {
      console.log("toggle on")
      this.props.navigation.setParams({ viewIcon: 'results' })
    }
    else {
      console.log("toggle off")
      this.props.navigation.setParams({ viewIcon: 'thumbnails' })
    }
  }
  toggleView = () => {

    // turn this off if choosing a list/grid option
    this.props.navigation.setParams({ starIcon: 'star-o' })

    // swap icon AFTER state has been changed
    this.setState({
      showFavorites: false, // turn this off if choosing a list/grid option
      showGrid: !this.state.showGrid
    }, () => this.swapViewIcon() );

  }

  // searchItemScreen = () => {
  //   this.props.navigation.navigate('ModulesSubMenu')
  // }


  swapFavoriteIcon = () => {

    console.log("this.state.showFavorites", this.state.showFavorites)

    let _this = this

    if(this.state.showFavorites) {


      getFavorites(function(idList){

        //console.log(">> got favorites", idList)

        getModuleItemsByIdList(idList, function(err, items){

          //console.log(">> matched items", items)

          _this.setState({
            favorites: items
          })

        })

      })

      console.log("toggle on")
      this.props.navigation.setParams({ starIcon: 'star' })
    }
    else {
      console.log("toggle off")
      this.props.navigation.setParams({ starIcon: 'star-o' })
    }
  }
  toggleFavorite = () => {

    console.log("toggleFavorite...")

    // swap icon AFTER state has been changed
    this.setState({
      showFavorites: !this.state.showFavorites
    }, () => this.swapFavoriteIcon() );

  }

  toggleSearch = () => {
     this.props.navigation.navigate('SearchItems')
  }

  onSelect = (item) => {

    this.props.navigation.navigate('ModulesSubMenu', { item: item })

  }
  onSelectFavorite = (item) => {

    console.log("opening web view", JSON.stringify(item, null, 2))
    this.props.navigation.navigate('ModulesWebView', { item: item })

  }

  render() {


     if(this.state.showFavorites) {

      return (

          <View style={styles.container}>

            <ScrollView style={{ backgroundColor: '#ffffff' }}>
              
              <List style={styles.list}>

                  {this.state.favorites.map((item, index) => (
                    <ListItem

                        key={index}
                        style={styles.listItem}
                        title={item.Name}
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View>
                          <View style={styles.subtitleView}>
                              <Text style={styles.ratingText}>{item.Tip_Text}</Text>
                          </View>
                          <View style={styles.subtitleView}>
                              <Text style={styles.ratingText}>{item.Path}</Text>
                          </View>
                        </View>
                        }

                        avatar={<Avatar rounded medium
                            overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                            icon={{name: 'star', type: 'font-awesome'}}/>}
                        
                        onPress={() => { this.onSelectFavorite(item) }}
                    
                    />
                    ))
                  }

              </List>

  
            </ScrollView>

            <View style={{ marginLeft:300,
              position: 'absolute',
              bottom: 20}}>
              
              <Avatar rounded medium
                  overlayContainerStyle={{backgroundColor: '#1867B2'}}
                  icon={{name: 'search', type: 'font-awesome'}}
                  onPress={()=> this.props.navigation.navigate('SearchItems')}
              />
                
            </View>
        

          </View>

      ) // end return

    }

    else if(this.state.showGrid) {
    
      return (
        <View style={{ backgroundColor: 'white' }}>

          <ScrollView style={{ backgroundColor: '#ffffff' }}>

            <FlatList
              data={this.state.data}
              numColumns={2} 
              keyExtractor={item => item.Menu_Heirarchy_ID}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity   style={styles.tile} onPress={() => { this.onSelect(item) }}>
                    <View style={styles.item}>

                          <FontAwesome name={item.Icon} size={40} color={brand.colors.white} />
                          <Text style={styles.text}>{item.Name}</Text>

                    </View>
                  </TouchableOpacity>
                );
              }}
            />

          </ScrollView>

          <View style={{ marginLeft:300,
    position: 'absolute',
    bottom: -30}}>
          <Avatar rounded medium
                  overlayContainerStyle={{backgroundColor: '#1867B2'}}
                  icon={{name: 'search', type: 'font-awesome'}}
                  onPress={()=> 
                    this.props.navigation.navigate('SearchItems')}/>
                
            </View>
        
        </View>
      
      ) // end return

    }
    else {

      return (

          <View style={styles.container}>

            <ScrollView style={{ backgroundColor: '#ffffff' }}>
              
              <List style={styles.list}>

                  {this.state.data.map((item, index) => (
                      <ListItem

                          key={index}
                          style={styles.listItem}
                          title={item.Name}
                              titleStyle={{ color: brand.colors.gray }}
                              

                          avatar={<Avatar rounded medium
                              overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                              icon={{name: item.Icon, type: 'font-awesome'}}/>}
                          
                          onPress={() => { this.onSelect(item) }}
                      
                      />
                    ))
                  }

              </List>

            </ScrollView>
            
            
             <View style={{ marginLeft:300,
                   position: 'absolute',
                  bottom: 20}}>
          
              <Avatar rounded medium
                  overlayContainerStyle={{backgroundColor: '#1867B2'}}
                  icon={{name: 'search', type: 'font-awesome'}}
                  onPress={()=> 
                    this.props.navigation.navigate('SearchItems')}/>
                
            </View>
          </View>

      ) // end return

    }



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
export default ModulesScreen;