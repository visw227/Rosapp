
import React from 'react';
import { StyleSheet, Text, View, Image, Button, FlatList } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import { List, ListItem, Avatar } from 'react-native-elements'


// hide warnings for now...
console.disableYellowBox = true;





export default class Test extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
          locations: [
      {
         "company": {
            "client": "DOHERTY",
            "companyId": 38,
            "startMinuteOfDay": 240,
            "suppressOutTimes": 1,
            "stopSwapHrs": 4,
            "enableProfilePics": 1,
            "enableCalendarSync": 1
         },
         "location": {
            "id": "135901123",
            "key": 165,
            "name": "Phillipsburg",
            "employeeId": 67474
         }
      },
      {
         "company": {
            "client": "DOHERTY",
            "companyId": 38,
            "startMinuteOfDay": 240,
            "suppressOutTimes": 1,
            "stopSwapHrs": 4,
            "enableProfilePics": 1,
            "enableCalendarSync": 1
         },
         "location": {
            "id": "135901123",
            "key": 162,
            "name": "Flemington",
            "employeeId": 71062
         }
      },
      {
         "company": {
            "client": "DOHERTY",
            "companyId": 38,
            "startMinuteOfDay": 240,
            "suppressOutTimes": 1,
            "stopSwapHrs": 4,
            "enableProfilePics": 1,
            "enableCalendarSync": 1
         },
         "location": {
            "id": "135901123",
            "key": 160,
            "name": "Bridgewater",
            "employeeId": 52319
         }
      }
   ]

      }
    }

    onDetailsPress = (name) => {

        console.log("pressed", name)
    }

    render () {
        return (
        <FlatList
            horizontal={true}
            data={this.state.locations}
            renderItem={({item}) => 
                <Text>{item.location.name}</Text>
            }

            ItemSeparatorComponent={() => {
                return (
                    <View
                        style={{
                        height: "100%",
                        width: 20,
                        backgroundColor: "#CED0CE",

                        }}
                    />
                );
            }}

            keyExtractor={(item, index) => index.toString()}
        />
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

