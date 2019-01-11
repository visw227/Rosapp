import React, { Component } from 'react';
import { View, TextInput, Image, Animated, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';

import logo from '../App/Images/logo-lg-white.png';




class Demo extends Component {
  constructor(props) {
    super(props);

    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.imageHeight, {
      duration: event.duration,
      toValue: IMAGE_HEIGHT,
    }).start();
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
          <Animated.Image source={logo} style={[styles.logo, { height: this.imageHeight }]} />
          <TextInput
            placeholder="Email"
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
          />
          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
          />
      </KeyboardAvoidingView>
    );
  }
};

const IMAGE_HEIGHT = window.width / 2;
const IMAGE_HEIGHT_SMALL = window.width /7;
const styles = StyleSheet.create({
 container: {
    backgroundColor: '#4c69a5',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    marginVertical: 5,
   // paddingVertical: 5,
    // paddingHorizontal: 15,
    width: window.width - 30,
  },
  logo: {
    height: IMAGE_HEIGHT,
    resizeMode: 'contain',
    marginBottom: 20,
    padding:10,
    marginTop:20
  },
  register:{
    marginBottom:20, 
    width:window.width -100,
    alignItems:'center',
    justifyContent:'center',
    height:50,
    backgroundColor: '#ffae',}
});

export default Demo;