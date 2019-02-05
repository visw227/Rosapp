import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  TextInput, 
  Image, 
  ActivityIndicator 
} from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import brand from '../../Styles/brand'
import Styles from './Styles'
import SearchBar from './SearchBar'


import Ionicon from 'react-native-vector-icons/Ionicons'

import { searchUsers } from '../../Services/SessionOverride';


class SearchUsers extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    //title: 'Search Rosnet Users',
    title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Search Rosnet Users': navigate.navigation.state.params.title,


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

  getTitle = (navigate) => {

    if(typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title)) {
       return 'Search Rosnet Users'
    }
    else {
       return navigate.navigation.state.params.title
    }


  }

  constructor(props) {
      super(props);


      this.state = {
          sending: false,
          receiving: false,
          selectedSite: "",
          userData: { sites: ["AAG", "DOHERTY"] },
          cookies: "",
          items: [],
          query: ''
      }
  }

  // this will catch an global state updates - via screenProps
  componentWillReceiveProps(nextProps){

    let selectedSite = nextProps.screenProps.state.selectedSite

    // ONLY if something has changed
    if(selectedSite !== this.state.selectedSite){

      console.log(">>> Dashboard picked up new selectedSite: ", selectedSite)

      this.props.navigation.setParams({ title: 'Search ' + selectedSite + ' Users' })
      
      this.setState({ 
        selectedSite: selectedSite
      });


    }

  }

  componentDidMount() {

    let _this = this 

    let userData = this.props.screenProps.state.userData

    let selectedSite = this.props.screenProps.state.selectedSite

    let cookies = "rememberme=" + userData.userName + "; clientCode=" + selectedSite + "; rosnetToken=" + userData.token


    _this.setState({
      userData: userData,
      selectedSite: selectedSite,
      cookies: cookies
    })

    this.props.navigation.setParams({ title: 'Search ' + selectedSite + ' Users' })
    
  }

  

  onSelect = (item) => {

    console.log("selected user: ", item)
    // this.props.navigation.navigate('ModulesWebView', { item: item })

  }

  getUsers = (query) => {

    // require at least 3 characters
    if(query.length < 3) {
      return
    }

    let _this = this

    this.setState({
      receiving: true
    })

    searchUsers(query, 100, this.state.selectedSite, this.state.cookies, function(err, resp){

      if(err) {
        _this.setState({
          receiving: false,
          query: query,
          items: []
        })
      }
      else {
        _this.setState({
          receiving: false, 
          query: query,
          items: resp
        })
      }


    })

  }

  render() {


    getResultsMessage = () => {

      if(this.state.query === '') {
        return (
          <Text style={{color: brand.colors.primary }}>{'Please enter a search term'}</Text>
        )
      }
      else if(this.state.query != '' && this.state.items.length === 1) {
        return (
          <Text style={{color: brand.colors.primary }}>{this.state.items.length + ' result found'}</Text>
        )
      }
      else if(this.state.query != '' && this.state.items.length > 1) {
        return (
          <Text style={{color: brand.colors.primary }}>{this.state.items.length + ' results found'}</Text>
        )
      }
      else if(this.state.query != '' && this.state.items.length === 0) {
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
            placeholder='Search Term'
            onChangeText = {(text)=> { this.getUsers(text) }}/>
            
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
 
        
        {this.state.receiving &&
          <View style={{ 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 15,
              marginTop: 10
          }}>
              <ActivityIndicator size="large" color={brand.colors.primary} />
          </View>
        }

        
        {this.state.items.length > 0 &&

          <View style ={{marginTop : -20}}>
          
            <ScrollView>

              <List style={styles.list}>

                {this.state.items.map((item, index) => (
                    <ListItem

                        key={index}
                        style={styles.listItem}
                        title={item.name}
                            titleStyle={{ color: brand.colors.gray }}
                            
                        subtitle={
                        <View style={styles.subtitleView}>
                            <Text style={styles.ratingText}>{item.group}</Text>
                        </View>
                        }
                        avatar={<Avatar rounded medium
                            overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                            icon={{name: 'user-o', type: 'font-awesome'}}/>}
                        
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

export default SearchUsers;