
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Text,
  Button
} from 'react-native';
import PropTypes from 'prop-types'

import { Badge } from 'react-native-elements'; // Version can be specified in package.json

import brand from '../../Styles/brand'

export default class PillButtons extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      items: []
    }

  }
  
  componentWillMount () {

    this.onRefresh()

  }

  onRefresh = () => {
      
    if(this.props && this.props.items && this.props.items.length > 0) {

        // non-mutating
        const newItems = this.props.items.map(newItem => {  
          newItem.selected = false
          return newItem;
        }); 
        newItems[0].selected = true 

        this.setState({
          items: newItems
        })

      }

  }

  // this hands the selected location back to the screen using this component
  setSelected = (button, item) => { 
      //this.setState({ selectedIndex })

      console.log("item", item)

      // non-mutating
      const newItems = this.props.items.map(newItem => {  
        newItem.selected = false
        if(newItem.id === item.id) {
          newItem.selected = true
        }
        return newItem;
      }); 

      this.setState({
        items: newItems
      })

      this.props.onSelection(item)

  }



  render() {

    return (

      <View style={styles.container}>
        {this.props.items.map(item => (

            <View 
              key={ 'pill_' + item.id}
              style={ item.selected ? styles.buttonWrapperSelected : styles.buttonWrapper } 
              >
              <Text
                  key={item.id}
                  style={ item.selected ? styles.buttonSelected : styles.button } 
                  onPress={() => this.setSelected(this, item) }
              >
                {item.label}
                      
              </Text>
            </View>

        ))}

      </View>
    )

  }

}

// PillButtons.propTypes = {
//   items: PropTypes.array,
//   onPress: PropTypes.func
// }

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    buttonWrapper: {
        backgroundColor: brand.colors.white,
        borderRadius:30,
        borderWidth: 1,
        borderColor: brand.colors.gray,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    buttonWrapperSelected: {
        backgroundColor: brand.colors.secondary,
        borderRadius:30,
        borderWidth: 1,
        borderColor: brand.colors.secondary,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 5,
        paddingBottom: 5,
        margin: 2,
    },
    button: {
        fontSize: 14,
        margin: 5,
        color: brand.colors.gray
    },
    buttonSelected: {
        fontSize: 14,
        margin: 5,
        color: brand.colors.white,
        // fontWeight: "bold"
        //textDecorationLine: 'underline'
    }
});
