'use strict'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class AvatarInitials extends Component {
  _getFontSize () {
    return this.props.single ? (this.props.size) / 1.7 : (this.props.size - 5) / 2
  }

  _getInitials (props) {
    let {text} = props
    if (text) {
      // if space delimited like a name, just take first and last initials - e.g. John Smith
      if (text.indexOf(' ') !== -1) {
        return (text.split(' ')[0].charAt(0) + text.split(' ')[1].charAt(0)).toUpperCase()
      } else { // otherwise, take the desired length
        return text.substring(0, this.props.length)
      }
    } else {
      return ''
    }
  }

  render () {
    return (
      <View style={{backgroundColor: 'transparent'}}>
        <View style={[styles.icon, {
          backgroundColor: this.props.backgroundColor,
          height: this.props.size,
          width: this.props.size,
          borderRadius: this.props.size / 2
        },
        this.props.style]}
        >
          <Text
            allowFontScaling={false}
            style={[
              styles.text,
              {fontSize: this.props.fontSize,
                color: this.props.color,
                backgroundColor: 'transparent'}]}
          >
            {this._getInitials(this.props)}
          </Text>
        </View>
      </View>
    )
  }
};

AvatarInitials.propTypes = {
  text: PropTypes.string.isRequired,
  size: PropTypes.any.isRequired,
  color: PropTypes.any,
  backgroundColor: PropTypes.any,
  single: PropTypes.bool
}

const styles = StyleSheet.create({
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  text: {
    color: '#fff'
  }
})

module.exports = AvatarInitials
