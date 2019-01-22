import React from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
//import styles from './Styles/AlertMessageStyles'
import styles from './AlertMesaageStyles'
export default class AlertMessage extends React.Component {
  static defaultProps = { show: true }

  static propTypes = {
    title: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    show: PropTypes.bool
  }

  render () {
    let messageComponent = null
    if (this.props.show) {
      const { title } = this.props
      return (
        <View style={[styles.container, this.props.style]}>
          <View style={styles.contentContainer}>
            <Text allowFontScaling={false} style={styles.message}>
              {title}
            </Text>
          </View>
        </View>
      )
    }

    return messageComponent
  }
}

AlertMessage.defaultProps = {
  show: true
}
