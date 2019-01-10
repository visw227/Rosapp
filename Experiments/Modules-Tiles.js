
import React from 'react';

import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../App/Styles/brand'

let fakedMenu = require('../App/Fixtures/Modules')

import { dynamicSort } from '../App/Lib/DynamicSort';

// hide warnings for now...
console.disableYellowBox = true;



export default class ReportsScreen extends React.Component {

  state = {
    data: [
      { Menu_Heirarchy_ID: "00", Name: "Relâmpago McQueen" },
      { Menu_Heirarchy_ID: "01", Name: "Agente Tom Mate" },
      { Menu_Heirarchy_ID: "02", Name: "Doc Hudson" },
      { Menu_Heirarchy_ID: "03", Name: "Cruz Ramirez" }
    ]
  };


    componentDidMount () {


      console.log("fakedMenu", fakedMenu["Heirarchy"])

      let parents = this.getParentHierarchy(fakedMenu["Heirarchy"])

      this.setState({
          parents: parents
      })

    }

  getParentHierarchy = (data) => {

    let parents = data.filter(function(item){
      return !item.Parent_Menu_Heirarchy_ID
    })

    parents.sort(dynamicSort('Ordinal', 1)) 

    // strip off "fa-" from icon name
    parents.forEach(function(item){
        item.Icon = item.Icon.replace('fa-', '')
    })

    console.log("found ", parents)

    this.setState({
        data: parents
    })

  }

  getChildren = (id, data) => {

    let children = data.filter(function(item){
      return item.Parent_Menu_Heirarchy_ID === id
    })

    children.sort(dynamicSort('Ordinal', 1)) 

    // strip off "fa-" from icon name
    children.forEach(function(item){
        item.Icon = item.Icon.replace('fa-', '')
    })

    console.log("children ", children)

    this.setState({
        data: children
    })

  }


  onSelect = (item) => {

    let items = this.getChildren(item.Menu_Heirarchy_ID, fakedMenu["Heirarchy"])

  }

  render() {

    
    return (
      <View style={{ marginTop: 50 }}>
        <FlatList
          data={this.state.data}
          numColumns={3} 
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
      </View>
    )
  }
}

const styles = StyleSheet.create({
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

