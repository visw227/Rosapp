import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Text
} from 'react-native';
import PropTypes from 'prop-types'

import { Badge } from 'react-native-elements'; // Version can be specified in package.json

import brand from '../../Styles/brand'

export default class PillButtons extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }

    console.log("props", this.props)


  }
  
    componentWillMount () {


        let _this = this 


        // let items = []
        // roleData.forEach(function(role){
        //     console.log("pushing", role)
        //     items.push({ id: role.id, label: role.desc })
        // })

        // console.log("items", items)

        // this.setState({
        //     items: items
        // })


    }

  // this hands the selected location back to the screen using this component
  updateIndex = (button, selectedIndex) => { 
      this.setState({ selectedIndex })

      // if All, the first index isn't a real location, so hand back a dummy one
      if(this.props.includeAll) {
        if(selectedIndex === 0) {
            this.props.onSelection(null)
        }
        else {
          this.props.onSelection(this.props.items[selectedIndex-1])
        }
      }
      else {
        this.props.onSelection(this.props.items[selectedIndex])
      }

  }



  render() {
    const buttons = [] //['Hello', 'World', 'Buttons']

    if(this.props.includeAll) {
      buttons.push('All')
    }

    let items = this.props.items
    items.forEach(function(item){
        buttons.push(item)
    })

    const { selectedIndex } = this.state

    return (
      <View style={styles.container}>
        {this.props.items.map(item => (

            <TouchableHighlight
                key={item.id}
                style={styles.button}
                activeOpacity = { .5 }
                onPress={() => this.updateIndex(this, item) }
            >
        
                <Text style={styles.text}>{item.label}</Text>
                    
            </TouchableHighlight>

        ))}

      </View>
    );
  }
}

PillButtons.propTypes = {
  items: PropTypes.array,
  onPress: PropTypes.func
}

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    button: {
        // marginTop:10,
        // paddingTop:15,
        // paddingBottom:15,
        // marginLeft:30,
        // marginRight:30,
        backgroundColor: brand.colors.secondary,
        borderRadius:30,
        borderWidth: 1,
        borderColor: '#fff',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 10,
        paddingBottom: 10
    },
    text: {
        textAlign: 'center',
        color: '#ffffff',
        padding: 2
    }
});
