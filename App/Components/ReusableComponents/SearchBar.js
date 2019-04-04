import React from 'react'
import PropTypes from 'prop-types'
import { View, Text, TextInput,StyleSheet,TouchableOpacity } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'



export default class SearchBar extends React.Component {
  static defaultProps = { show: true }

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
  }

  render () {
    
      const { title } = this.props
      return (
        <View style={styles.searchSection}>
          <TextInput
              style={styles.input}
              placeholder="User Nickname"
              onChangeText={(searchString) => {this.setState({searchString})}}
              underlineColorAndroid="transparent"
              value={this.props.value}
              onChangeText ={this.props.onChangeText}
              placeholder ={this.props.placeholder}
              autoCorrect={false} 
          />
          <TouchableOpacity>
          <FontAwesome style={styles.searchIcon} name="search" size={17} color= "#778899"/>
          </TouchableOpacity>

        </View>
      )
    

    
  }
}


const styles = StyleSheet.create({

searchSection: {
  flexDirection: 'row',
  borderWidth: 1,
  margin:1,
  borderColor: '#D3D3D3',
  backgroundColor:'#D3D3D3',
  padding: 10,
  borderRadius: 2,
  height:40
},
searchIcon: {
  marginLeft: 10,
  padding: 10,
  paddingTop: 0,
  paddingRight: 10,
  paddingBottom: 12,
  paddingLeft: 0,
  marginTop:-1,
  backgroundColor: '#D3D3D3',
  color : "#A9A9A9"
},
input: {
  flex: 1,
  paddingTop: 0,
  paddingRight: 10,
  paddingBottom: 0,
  paddingLeft: 15,
  marginTop:-4,
  height:25,
  backgroundColor: '#ffffff',
  borderRadius:15
  // color : "blue",
}

});



