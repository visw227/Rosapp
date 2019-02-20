import React from 'react'
import { StyleSheet, Text, View, Image, AsyncStorage, TouchableHighlight, ScrollView } from 'react-native'
import { NavigationActions, StackActions } from 'react-navigation'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'

import { userLogout } from '../Services/Account';

import brand from '../Styles/brand'

export default class DrawerContainer extends React.Component {



  logout = () => {

        console.log("logging out...")

        let _this = this

        AsyncStorage.removeItem('userData', function(err){

          // this API request will delete the user's token from the database
          userLogout(_this.props.screenProps.state.userData.selectedSite, _this.props.screenProps.state.userData.token, function(err,resp){

            // this shows a back arrow, so don't use this
            //this.props.navigation.navigate('LoginStack')

            // instead, reset the navigation
            const resetAction = StackActions.reset({
                index: 0,
                key: null, // this is the trick that allows this to work
                actions: [NavigationActions.navigate({ routeName: 'LoginStack' })],
            });
            _this.props.navigation.dispatch(resetAction);

          })


          
        })

  }


  // using routeKey allows us to reuse the same ModulesSubMenu route but with different menu data being passed to it
  navigateTo = (routeName, routeParams, routeKey) => {

    console.log("DrawerContainer - navigateTo", routeName, routeParams, routeKey)

    this.props.navigation.navigate({
      routeName: routeName,
      params: { 
        item: routeParams,
      },
      key: 'RouteKey_' + routeKey
    });
  }

  undoImpersonation = () => {

      let userData = this.props.screenProps.state.superUser

      // place the impersonated user's data into userData, but copy the "real" user into superUser so that we can revert back later...
      this.props.screenProps._globalStateChange( { action: "undo-session-override", userData: userData, superUser: null })
      

  }

  render() {

    const { navigation } = this.props

    //console.log(">>>>>>>>>   DrawerContainer screenProps", this.props.screenProps)


    // using routeKey allows us to reuse the same ModulesSubMenu route but with different menu data being passed to it
    DrawerLabel = ({ label, icon, routeName, routeParam, routeKey, iconSize, iconType, logout }) => (
      <TouchableHighlight  
      
        underlayColor="#fff"

        onPress={() => logout ? this.logout() : this.navigateTo(routeName, routeParam, routeKey) }>

        <View style={{
          alignItems: 'center',
          flexDirection: 'row',
          height: 40,
          paddingLeft: 5,
          width: '100%',
          backgroundColor: brand.colors.primary,
          marginBottom: 1
        }}>
          <View style={{ alignItems: 'center', width: 30, backgroundColor: brand.colors.primary }}>
            {iconType && iconType === 'Entypo' ? (
             <Entypo name={icon} size={iconSize} color={brand.colors.white} />
            ) : (
             <FontAwesome name={icon} size={iconSize} color={brand.colors.white} />
            )}
          </View>
          <View>
            <Text
              style={styles.drawerItem}
            >
              {label}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );


    return (
      <View style={styles.container}>

        <View style={{ alignItems: 'center' }}>
          <Image
            resizeMode="contain" 
            source={require('../Images/logo-xs-white.png')} />
        </View>

        <View style={{  flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        alignContent: 'space-between', 
                        marginTop: 10 }}>
          <Text style={{ margin: 5, color: 'white', fontSize: 16 }}>
           {this.props.screenProps.state.userData.commonName}
           </Text>
           {this.props.screenProps.state.superUser && 
            <FontAwesome name={'undo'} size={20} style={{ margin: 5, color: brand.colors.white}}
              onPress={() => { this.undoImpersonation() }}
            />
            } 
        </View>

        {/* // 'separator' line */}
        <View
            style={{
            borderBottomColor: brand.colors.silver,
            borderBottomWidth: 1,
            marginTop: 10,
            marginBottom: 10
        }}/>
      

        <ScrollView
            style={{ paddingBottom: 100 }}
          >


          <DrawerLabel
            icon={'search'}
            label={'Search'}
            routeName={'SearchItems'}
            iconSize={25}
          /> 


          <DrawerLabel
            icon={'tachometer'}
            label={'Dashboard'}
            routeName={'Tabs'}
            iconSize={25}
          /> 


          {this.props.screenProps.state.userData.menuItems.map(item => (

            <DrawerLabel
              key={item.id}
              icon={item.icon}
              label={item.name}
              routeName={'ModulesItems'}
              routeParam={item}
              routeKey={item.id}
              iconSize={25}
            /> 
           ))}


          {/* // 'separator' line */}
          <View
              style={{
              borderBottomColor: brand.colors.silver,
              borderBottomWidth: 1,
              marginTop: 10,
              marginBottom: 10
          }}/>

           {this.props.screenProps.state.userData.sites.length > 1 && 
            <DrawerLabel
              icon={'window-restore'}
              label={'Select a Site'}
              routeName={'ClientSelection'}
              iconSize={25}
            /> 
           } 

            {this.props.screenProps.state.userData.isRosnetEmployee &&  
            <DrawerLabel
              icon={'user-plus'}
              label={'Session Override'}
              routeName={'SessionOverride'}
              iconSize={25}
            /> 
            }  
            
          <DrawerLabel
            icon={'user'}
            label={'StaffLinQ Employees'}
            routeName={'StaffList'}
            iconSize={25}
          /> 

          <DrawerLabel
            icon={'user-circle-o'}
            label={'Account'}
            routeName={'Account'}
            iconSize={25}
          /> 

          <DrawerLabel
            icon={'support'}
            label={'Support'}
            routeName={'Support'}
            iconSize={25}
          /> 


          <DrawerLabel
            icon={'sign-out'}
            label={'Logout'}
            routeName={''}
            iconSize={25}
            logout={true}
          /> 

       </ScrollView>

      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: brand.colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20
  },
  drawerItem: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: brand.colors.white,
    padding: 0,
    marginLeft: 5,
    // borderRadius: 2,
    // borderColor: '#E73536',
    // borderWidth: 1,
    textAlign: 'left'
  }
})