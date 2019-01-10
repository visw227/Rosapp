import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView,TextInput,Image } from 'react-native'
import { List, ListItem, Avatar } from 'react-native-elements'
import brand from '../../Styles/brand'
import Styles from './Styles'
import { getSubMenuItems } from '../../APIs/Modules';
import AlertMessage from '../ReusableComponents/AlertMessage'
import SearchBar from '../ReusableComponents/SearchBar'
let fakedMenu = require('../../Fixtures/Modules')



class SearchItems extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({
    title: 'Search Modules',
    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',
  })
  constructor(props) {
      super(props);
      this.state = {
          sending: true,
          receiving: true,
          data: fakedMenu["Items"],
          text:null,
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
      element.Name = element.Menu_Function_Name
      if(element.Tip_Text.toLowerCase().indexOf(this.state.text && this.state.text.toLowerCase()) !== -1) {
        sortedData.push(element)
      }
    });
    //const finalData = sortedArray.length > 0 ? sortedArray : []

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
              timePassed :true
            })
            setTimeout(() => {this.setState({timePassed: false})}, 4000)

            this.setState({
              text
            })
          }}/>
            
        </View>

        <View style ={{marginLeft:114,
                   position: 'absolute',
                  top: 35}}>
        {
          this.state.text !== '' ? <AlertMessage title = {sortedData.length + ' results found'}/> :
          <AlertMessage title = '0 results found'/>
        }
        </View>

        

        {
          sortedData.length < 1 && this.state.text !== ''? <AlertMessage title = 'Modify Search'/>
          
          : this.state.timePassed ?  <View style={styles.loader}> 
          
          <Image source={require('../../Images/ajax-loader.gif')} style={{width: 50, height: 50,marginTop:70}}/>
          
          </View>     : this.state.text === '' ? <AlertMessage title = 'Start Search'/> :

          <View style ={{marginTop : 20}}>
          
          <ScrollView style={{ backgroundColor: '#ffffff' }}>

            <List style={styles.list}>

              {sortedData.map((item, index) => (
                  <ListItem

                      key={index}
                      style={styles.listItem}
                      title={item.Name}
                          titleStyle={{ color: brand.colors.gray }}
                          
                      subtitle={
                      <View style={styles.subtitleView}>
                          <Text style={styles.ratingText}>{item.Tip_Text}</Text>
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