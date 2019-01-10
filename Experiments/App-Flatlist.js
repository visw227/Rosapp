
import React from 'react';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import { List, ListItem, Avatar } from 'react-native-elements'


// hide warnings for now...
console.disableYellowBox = true;



class Test extends React.Component {

    onDetailsPress = (name) => {

        console.log("pressed", name)
    }

    render () {
        return (
            <List>

                <ListItem
                    roundAvatar
                    style={styles.listItem}
                    title='Terms & Conditions'

                    subtitle={
                    <View style={styles.subtitleView}>
                        <Text style={styles.ratingText}>Terms and conditions for using this app</Text>
                    </View>
                    }
                    avatar={<Avatar rounded medium 
                        overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                        icon={{name: 'list-ol', type: 'font-awesome' }}/>}

                    onPress={() => this.onDetailsPress('Terms')}

                />

                <ListItem

                    style={styles.listItem}
                    title='Privacy Policy'

                    subtitle={
                    <View style={styles.subtitleView}>
                        <Text style={styles.ratingText}>How we protect your data</Text>
                    </View>
                    }
                    avatar={<Avatar rounded medium
                        overlayContainerStyle={{backgroundColor: '#31B0D5'}}
                        icon={{name: 'user-secret', type: 'font-awesome'}}/>}
                    
                    onPress={() => this.onDetailsPress('Privacy')}
                
                />

            </List>
        )
    }

}


styles = StyleSheet.create({
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5
  },
  listItem: {
    marginTop: 10,
    marginBottom: 10
  },
  ratingImage: {
    height: 19.21,
    width: 100
  },
  ratingText: {
    paddingLeft: 0,
    color: '#808080'
  },

})

export default Test