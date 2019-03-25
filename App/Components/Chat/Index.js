import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    AsyncStorage,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    SectionList,
    Alert,
    TouchableHighlight,
    Modal,
    Picker,
    WebView,
    ActivityIndicator,
    Keyboard,
    TextInput
} from 'react-native';

import { List, ListItem, Avatar } from 'react-native-elements'



import Ionicon from 'react-native-vector-icons/Ionicons'


import brand from '../../Styles/brand'
import Styles from './Styles'


import appConfig from '../../app-config.json'


let fakedUserProfile = require('../../Fixtures/UserProfile')


//let chatUrl = "http://localhost:3000" ///theme/conversation-home-3.html"
let chatUrl = "http://dj-chat-app.herokuapp.com/#/"


class DashboardScreen extends React.Component {

    static navigationOptions = (navigate) => ({

        title: 'Chat',

        // these seem to ONLY work here
        headerStyle: { backgroundColor: typeof(navigate.navigation.state.params) === 'undefined' || typeof(navigate.navigation.state.params.backgroundColor) === 'undefined' ? brand.colors.primary : navigate.navigation.state.params.backgroundColor },
        headerTintColor: 'white',
        headerLeft: < Ionicon
                name = "md-menu"
                size = { 35 }
                color = { brand.colors.white }
                style = {
                    { paddingLeft: 10 }
                }
                onPress={() => navigate.navigation.state.params.menuIconClickHandler(navigate) }
            />,

        // headerRight : 
        //   <View style={{
        //     alignItems: 'center',
        //     flexDirection: 'row',
        //     height: 40,
        //     paddingRight: 10,
        //     width: '100%'
        //   }}>

        //     <FontAwesome
        //         name="window-restore"
        //         size={20}
        //         color={brand.colors.white}
        //         style={{ marginRight: 10 }}
        //         onPress={ navigate.navigation.getParam('toggleClientModal') }
        //     />

        //   </View>,

    })


    // needed a way to perform multiple actions: 1) Dismiss the keyboard, 2) Open the Drawer
    // this is passed in to navigationOptions as menuIconClickHandler
    onMenuIconClick = (navigate) => {

        navigate.navigation.toggleDrawer()

        // 3/25/2019 - NOTE: Keyboard.dismiss() is NOT currently working in react native since a webview
        // supposedly fixed in a later react native release
        this.fakedInput.focus();
        Keyboard.dismiss()

    }


    constructor(props) {
        super(props);

        // console.log("Dashboard props.screenProps", JSON.stringify(props.screenProps, null, 2))


        this.state = {
            sending: false,
            receiving: true,
            requestStatus: {
                hasError: false,
                message: ""
            },
            userProfile: fakedUserProfile,
            userData: { sites: ["AAG", "DOHERTY"], selectedSite: "AAG" }
        }


    }




    // this will catch any global state updates - via screenProps
    componentWillReceiveProps(nextProps) {

        let selectedSite = nextProps.screenProps.state.userData.selectedSite
        let token = nextProps.screenProps.state.userData.token

        // ONLY if something has changed
        if (token !== this.state.userData.token) {

            console.log(">>> Dashboard picked up new token: ", token)

            let userData = this.props.screenProps.state.userData

            let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

            let source = {
                uri: chatUrl,
                headers: {
                    "managerAppToken": token
                }
            }

            console.log("source updated: ", JSON.stringify(source, null, 2))


            this.setState({
                userData: userData,
                source: source
            });

        }

        // ONLY if something has changed
        if (selectedSite !== this.state.userData.selectedSite) {

            console.log(">>> Dashboard picked up new selectedSite: ", selectedSite)

            this.props.navigation.setParams({ title: selectedSite })

            let userData = this.props.screenProps.state.userData

            let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

            let source = {
                uri: chatUrl,
                headers: {
                    "managerAppToken": userData.token
                }
            }

            console.log("source updated: ", JSON.stringify(source, null, 2))


            this.setState({
                selectedSite: selectedSite,
                source: source
            });


        }

    }


    componentDidMount() {

        let _this = this

        let userData = this.props.screenProps.state.userData

        this.props.navigation.setParams({ 
            menuIconClickHandler: this.onMenuIconClick,
            title: userData.selectedSite, 
            backgroundColor: this.props.screenProps.state.backgroundColor
        })

        let env = appConfig.DOMAIN // rosnetdev.com, rosnetqa.com, rosnet.com

        let source = {
            uri: chatUrl,
            headers: {
                "managerAppToken": userData.token,
                //"Cookie": "rememberme=" + userData.userName + "; clientCode=" + selectedSite + "; rosnetToken=" + userData.token 
            }
        }


        console.log("Dashboard source", JSON.stringify(source, null, 2))


        _this.setState({
            userData: userData,
            source: source
        })



    }



    _renderLoading = () => {
    //   return (

    //     <Progress.Bar progress={0.4} width={700} />

    //   )
        return (
            <ActivityIndicator
                color='#ffffff'
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        )
    }

    render() {



            return (

                    <
                    View style = {
                        { backgroundColor: brand.colors.primary, height: '100%' }
                    } >

                        <TextInput ref={x => this.fakedInput = x} style={{ height: 0, backgroundColor: '#ffffff' }}  />

                    {
                        this.state.source &&
                        <WebView
                            source={ this.state.source }

                            //Enable Javascript support
                            javaScriptEnabled={true}
                            //For the Cache
                            domStorageEnabled={true}

                            //Want to show the view or not
                            startInLoadingState={true}

                            //onLoadProgress={e => console.log(e.nativeEvent.progress)}
                            renderLoading={this._renderLoading}

                            //injectedJavaScript = { hideSiteNav }

                            style = {
                                { flex: 1 }
                            }

                            scrollEnabled = { false }
                        />
                    }


                    </View>

                ) // end return




        } // end render

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: 20,
        backgroundColor: brand.colors.primary,
        paddingLeft: 40,
        paddingRight: 40
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        // position: 'absolute',
        // width: 400,
        // height: 200
    },
    text: {
        fontSize: 18,
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 140,
        height: 50,
        backgroundColor: brand.colors.secondary,
        borderRadius: 5,
        marginTop: 80
    },
    buttonText: {
        fontSize: 20,
        color: '#fff'
    },
    ActivityIndicatorStyle:{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    
    }
});

//make this component available to the app
export default DashboardScreen;