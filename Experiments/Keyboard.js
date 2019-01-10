import React, { Component } from 'react';
import { Text, View, StyleSheet, KeyboardAvoidingView, TextInput, ScrollView, SafeAreaView, Image } from 'react-native';
import { Constants } from 'expo';


import brand from '../App/Styles/brand'
// hide warnings for now...
console.disableYellowBox = true;

content = [1,2,3,4,5,6,7,8,9,10]

export default class App extends Component {
  render() {
    return (

<SafeAreaView style={styles.container}>
   <KeyboardAvoidingView style={styles.keyboardAvoidContainer} behavior="padding">
     <ScrollView style={{flex: 1}}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
          
      </ScrollView>
      <TextInput style={{height: 40, width: '100%', backgroundColor: '#fff', paddingLeft: 10,  color: '#fff'}} placeholder={'Enter text here'}/>
    </KeyboardAvoidingView>
 </SafeAreaView>

    );
  }
}

const styles = StyleSheet.create({
      header:{
    backgroundColor: brand.colors.secondary,
    height:130,
    width: '100%'
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:60
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'white',
  },
    input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        padding: 10,
        color: 'green',
        borderColor: '#e9e9e9', 
        borderWidth: 1,
        borderRadius: 5
    },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'red',
  },
});
