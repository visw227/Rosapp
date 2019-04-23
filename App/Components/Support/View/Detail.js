import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TextInput,
  Button,
  AsyncStorage,
  ScrollView,
  RefreshControl,
  Platform
} from 'react-native';

import { List, ListItem, Avatar } from 'react-native-elements'

import Ionicon from 'react-native-vector-icons/Ionicons'
//import Entypo from 'react-native-vector-icons/Entypo'

import brand from '../../../Styles/brand'

// import Styles from '../Styles'

import { Utils } from '../../../Helpers/Utils'


class SupportRequestDetail extends React.Component {

  // this is a child/nested screen in the SchedulesStack
  // Look at SchedulesStack for tricks with hiding the tabBar and hiding the back button title
  static navigationOptions = (navigate) => ({

    title: 'Support Request',

    // these seem to ONLY work here
    headerStyle: {backgroundColor: brand.colors.primary },
    headerTintColor: 'white',


  })

  constructor(props) {
    super(props);

  

    this.state = {
        receiving: false,
        item: { subject: "", description: ""}
    }

  }

  componentDidMount() {

    const { navigation } = this.props;
    const requestItem = navigation.getParam('requestItem', null );

    console.log("requestItem", JSON.stringify(requestItem, null, 2))
    if(requestItem) {
        this.setState({
            item: requestItem
        })
    }


  }


  render() {


    return (

        
        <ScrollView>
            <View style={styles.formContainer}>


                <Text style={styles.inputLabel}>Subject</Text>


                <Text style={styles.displayText}>{this.state.item.subject}</Text>



                <Text style={styles.inputLabel} >Description</Text>


                <Text style={styles.displayText}>{this.state.item.description}</Text>





                

            </View>
        </ScrollView>

    );

  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: brand.colors.white,

    },
    formContainer: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    inputLabel: {
      color: brand.colors.primary,
      marginTop: 15, 
      marginBottom: 10,
      marginLeft: 5,
      fontSize: 18,
      fontWeight: 'bold'
    },
    displayText: {
      color: brand.colors.primary,
      marginTop: 15, 
      marginLeft: 5,
      fontSize: 18
    },
    message: {
      textAlign: 'center', 
      paddingTop: 20, 
      paddingLeft: 30, 
      paddingRight: 30,
      color: brand.colors.primary
    },
    inputNewPassword: {

      flexGrow: 1,
      flexBasis: 85,
      height: 40,
      backgroundColor: '#ffffff',
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      color: brand.colors.primary,
      borderColor: brand.colors.primary, 
      borderWidth: 1,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,

    },
    strengthDisplay: {

      flexGrow: 1,
      flexBasis: 15,
      height: 40,
      backgroundColor: brand.colors.lightGray,
      marginTop: 5,
      marginBottom: 5,
      padding: 10,
      borderColor: brand.colors.primary, 
      borderTopWidth: 1,
      borderRightWidth: 1,
      borderBottomWidth: 1,
      borderLeftWidth: 0,
      borderTopRightRadius: 10,
      borderBottomRightRadius: 10,
      maxWidth: 120

    }
   
});



//make this component available to the app
export default SupportRequestDetail;