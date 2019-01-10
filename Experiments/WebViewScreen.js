
import React from 'react';

import { StyleSheet, Text, View, FlatList,WebView } from 'react-native'

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'

import brand from '../App/Styles/brand'


// hide warnings for now...
console.disableYellowBox = true;




export default class WebViewScreen extends React.Component {

  
  render() {

    const source = {
      uri: "https://aag.rosnetqa.com/Report/Select/1113",
      headers: {
        "Cookie": "rememberme=dywayne.johnson; clientCode=aag; rosnetToken=b32f381e-4151-4de1-9d23-a0e03ea5ece5" 
      }
    };

    
    return (
      
      <WebView
           source={source}
           onLoadProgress={e => console.log(e.nativeEvent.progress)}
           //injectedJavaScript={this.state.cookie}
           style={{ flex: 1 }}
         />
      
    
    )
  } 
}

const styles = StyleSheet.create({
  item: {
    alignItems: "center",
    backgroundColor: brand.colors.secondary,
    flexGrow: 1,
    flexBasis: 0,
    margin: 2,
    padding: 20
  },
  text: {
    color: 'white',
    fontWeight: 'normal',
  }
});

