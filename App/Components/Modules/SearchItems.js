import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView,TextInput,Image } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import brand from '../../Styles/brand'
import Styles from './Styles'
import SearchBar from './SearchBar'


import Ionicon from 'react-native-vector-icons/Ionicons'



class SearchItems extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Search',
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


      let items = []

      this.props.screenProps.state.menuItems.forEach(function(root){

        root.subs.forEach(function(sub){
          sub.items.forEach(function(item){
            items.push(item)
          })
        })
      })

      console.log("items", items)

      this.state = {
          sending: true,
          receiving: true,
          data: items,
          text: '',
          searchData : [],
          timePassed:true
      }
  }

  componentDidMount () {
    
    // let _this = this
    // const { navigation } = this.props;
    // const parent = navigation.getParam('item', { id: 0, name: null} );
    // this.props.navigation.setParams({ title: parent.Name })


  }

  onSelect = (item) => {

    console.log("opening web view", item)
    this.props.navigation.navigate('ModulesWebView', { item: item })

  }

  render() {

    const sortedData = []
    this.state.data.forEach(element => {
      // just to normalize a Name attribute to match the ["Hierarchy"] collection
      element.Name = element.name
      if(element.name.toLowerCase().indexOf(this.state.text && this.state.text.toLowerCase()) !== -1) {
        sortedData.push(element)
      }
      else if(element.description.toLowerCase().indexOf(this.state.text && this.state.text.toLowerCase()) !== -1) {
        sortedData.push(element)
      }
    });


    getResultsMessage = () => {

      if(this.state.text === '') {
        return (
          <Text style={{color: brand.colors.primary }}>{'Please enter a search term'}</Text>
        )
      }
      else if(this.state.text != '' && sortedData.length === 1) {
        return (
          <Text style={{color: brand.colors.primary }}>{sortedData.length + ' result found'}</Text>
        )
      }
      else if(this.state.text != '' && sortedData.length > 1) {
        return (
          <Text style={{color: brand.colors.primary }}>{sortedData.length + ' results found'}</Text>
        )
      }
      else if(this.state.text != '' && sortedData.length === 0) {
        return (
          <Text style={{color: brand.colors.primary }}>{'Sorry, no results found.'}</Text>
        )
      }

    }



    return (
      
      <View style={styles.container}>

        <View style = {{marginTop:20}}>
          
          <SearchBar
            lightTheme={true}
            color ='blue'
            value={this.state.text}
            placeholder='Search Modules'
            onChangeText = {(text)=> {
              this.setState({
                timePassed :false
              })
              //setTimeout(() => {this.setState({timePassed: false})}, 4000)

              this.setState({
                text
              })
          }}/>
            
        </View>


        {/* This will allow the alert message to flex correctly for tablets too */}
        <View style={{ 
            justifyContent: 'center', 
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 10
        }}>
            {getResultsMessage()}
        </View>
 
        
        {this.state.text !== '' && sortedData.length > 0 &&

          <View style ={{marginTop : -20}}>
          
            <ScrollView>

              <List style={styles.list}>

                {sortedData.map((item, index) => (
                    <ListItem

                        key={index}
                        style={styles.listItem}
                        title={item.name}
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{item.description}</Text>
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

          </View>
        
        }

      </View>

    ) 

  }


} 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 0,
    marginTop: -20
  },
  loader : {
    flex:1,
    flexDirection:'column',
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:30
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

export default SearchItems;