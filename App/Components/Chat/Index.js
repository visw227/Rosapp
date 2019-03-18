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
    WebView
} from 'react-native';

import { List, ListItem, Avatar } from 'react-native-elements'

import * as Progress from 'react-native-progress'

import moment from 'moment'
import Ionicon from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import brand from '../../Styles/brand'
import Styles from './Styles'


import appConfig from '../../app-config.json'


import LocationButtons from '../ReusableComponents/LocationButtons'


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
        onPress = {
            () => navigate.navigation.toggleDrawer()
        }
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

        this.props.navigation.setParams({ title: userData.selectedSite, backgroundColor: this.props.screenProps.state.backgroundColor })

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


        // associate the handler
        this.props.navigation.setParams({ toggleClientModal: this.toggleClientModal })

    }



    // _renderLoading = () => {
    //   return (

    //     <Progress.Bar progress={0.4} width={700} />

    //   )
    // }

    render() {



            return (

                    <
                    View style = {
                        { backgroundColor: brand.colors.primary, height: '100%' }
                    } >

                    {
                        this.state.source &&
                        <
                        WebView
                        source = { this.state.source }
                        startInLoadingState = { true }
                        //onLoadProgress={e => console.log(e.nativeEvent.progress)}
                        //renderLoading={this._renderLoading}
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
    }
});

//make this component available to the app
export default DashboardScreen;