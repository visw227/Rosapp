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

import { Chat } from '../../Helpers/Chat';


class ChatScreen extends React.Component {

    static navigationOptions = (navigate) => ({

        title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'Chat': navigate.navigation.state.params.title,


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
            userData: this.props.screenProps.state.userData,
            selectedClient: this.props.screenProps.state.selectedClient
        }


    }

    loadUrl = (client, token) => {

        let now = new Date().getTime()


        let protocol = "https://"
        // if NOT rosnetdev.com, rosnetqa.com, rosnet.com, probably running as localhost or ngrok
        if (appConfig.DOMAIN.indexOf('rosnet') !== -1) {
            protocol = "https://"
        } else {
            protocol = "http://"
        }

        let url = protocol + 
                client + "." + 
                appConfig.DOMAIN + "/chatapp?app=rosnet&client=" + client + 
                "&token=" + token + 
                "&__dt=" + now

        let source = {
            uri: url,
            // headers: {
            //     "Cookie": "rosnetToken=" + userData.token,
            // }
        }
 
        console.log("Chat screen source", JSON.stringify(source, null, 2))

        this.setState({
            source: source
        })

    }

    componentDidMount() {

        // DONT use willFocus here since we want the chat webview to stay on the same url unless the token or client changes
        //this.props.navigation.addListener('willFocus', this.load)


        let now = new Date().getTime()

        let userData = this.props.screenProps.state.userData
        let selectedClient = this.props.screenProps.state.selectedClient

        this.props.navigation.setParams({ 
            title: 'Chat - ' + this.props.screenProps.state.selectedClient,
            menuIconClickHandler: this.onMenuIconClick,
            backgroundColor: this.props.screenProps.state.backgroundColor
        })

        this.loadUrl(this.props.screenProps.state.selectedClient, userData.token)

        this.setState({
            userData: userData,
            selectedClient: selectedClient
        })

    }

    // this will catch any global state updates - via screenProps
    componentWillReceiveProps(nextProps) {

        let now = new Date().getTime()

        let next_client = nextProps.screenProps.state.selectedClient
        let next_token = nextProps.screenProps.state.userData.token

        // ONLY if something has changed
        if (next_token !== this.props.screenProps.state.userData.token) {

            console.log("Chat screen picked up new token: ", next_token)

            let userData = nextProps.screenProps.state.selectedClient

            this.setState({
                userData: userData
            });

            this.loadUrl(this.props.screenProps.state.selectedClient, next_token)

        }

        // ONLY if something has changed
        if (next_client !== this.props.screenProps.state.selectedClient) {

            console.log("Chat screen picked up new selectedClient: ", next_client)

            this.setState({
                selectedClient: next_client
            });

            this.loadUrl(next_client, this.props.screenProps.state.userData.token)

            this.props.navigation.setParams({ 
                title: 'Chat - ' + next_client
            })

        }

    }




    _renderLoading = () => {
        return (
            <ActivityIndicator
                color='#ffffff'
                size='large'
                style={styles.ActivityIndicatorStyle}
            />
        )
    }

    onLoadEnd = (url) => {
        let _this = this

        // there are only 3 urls: /conversation-list, /conversation, /start-conversation
        // the / index page handles that authentication
        // refresh the unread count when the user is on the /conversation-list or /conversation page
        if(url.indexOf('conversation-list') !== -1 || url.indexOf('conversation') !== -1) {
            this.resetUnreadCount()
        }



        console.log("onLoadEnd: " + url)
    }

    resetUnreadCount = () => {

        Chat.GetUnreadMessageCount('rosnet', this.props.screenProps.state.selectedClient, this.props.screenProps.state.userData.token, function(err, resp){

          if(err) {

          }
          else {
            let count = 0
            if(resp && resp.length > 0) {
              resp.forEach(function(c){
                count += c.unread_count
              })
            }

            _this.props.screenProps._globalStateChange( { action: "chat", messageCount: count })
          }
        })

    }

    render() {



            return (

                // NOTE: keyboardShouldPersistTaps doesnt solve the click twice issue
                // <ScrollView keyboardShouldPersistTaps="always" style ={{backgroundColor: brand.colors.primary, height: 600}}>

                    <View style ={{backgroundColor: brand.colors.primary, height: '100%'}}>

                        <TextInput ref={x => this.fakedInput = x} style={{ height: 0, backgroundColor: '#ffffff' }}  />

                        {this.state.source &&
                            <WebView
                                source={ this.state.source }

                                // DJ - crash-on-reload? Enable Javascript support
                                //javaScriptEnabled={true}

                                // DJ - crash-on-reload? For the Cache
                                //domStorageEnabled={true}

                                onLoadEnd={(e) => {
                                    //console.log('onLoadSEnd');
                                    //console.log(e.nativeEvent.url);
                                    this.onLoadEnd(e.nativeEvent.url)
                                }}


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
                    // </ScrollView>

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
export default ChatScreen;