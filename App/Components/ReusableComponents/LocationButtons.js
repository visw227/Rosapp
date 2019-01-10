
import React from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import PropTypes from 'prop-types'

// or any pure javascript modules available in npm
import { ButtonGroup } from 'react-native-elements'; // Version can be specified in package.json

import brand from '../../Styles/brand'

export default class LocationButtons extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      selectedIndex: 0
    }

    // console.log("props", this.props)
  }
  
  // this hands the selected location back to the screen using this component
  setSelected = (selectedIndex) => { 
      this.setState({ selectedIndex })

      // if All, the first index isn't a real location, so hand back a dummy one
      if(this.props.includeAll) {
        if(selectedIndex === 0) {
            this.props.onSelection(null)
        }
        else {
          this.props.onSelection(this.props.locations[selectedIndex-1])
        }
      }
      else {
        this.props.onSelection(this.props.locations[selectedIndex])
      }

  }

  render() {
    const buttons = [] //['Hello', 'World', 'Buttons']

    if(this.props.includeAll) {
      buttons.push('All')
    }

    let locations = this.props.locations
    locations.forEach(function(location){
        buttons.push(location.location.name)
    })

    const { selectedIndex } = this.state

    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.setSelected}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={{height: 40, marginLeft: 1, marginTop: 1, marginRight: 2, marginBottom: 1}}
          textStyle={{
              color: brand.colors.gray,
              fontSize: this.props && this.props.fontSize || 14,
          }}
          selectedButtonStyle={styles.selectedButtonStyle}
          selectedTextStyle={styles.selectedTextStyle}
        />
      </View>
    );
  }
}

LocationButtons.propTypes = {
  size: PropTypes.any,
  color: PropTypes.any,
  backgroundColor: PropTypes.any,
  locations: PropTypes.array,
  onSelection: PropTypes.func
}

const styles = StyleSheet.create({
    container: {

    },
    buttonGroup_textStyle: {
      color: brand.colors.gray,
      fontSize: this.props && this.props.fontSize || 14,
    },
    selectedButtonStyle: {
        backgroundColor: brand.colors.secondary
    },
    selectedTextStyle: {
        color: brand.colors.white
    }
});
