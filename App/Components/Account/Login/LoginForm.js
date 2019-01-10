//import liraries
import React, { Component } from 'react';
import { 
    View, 
    Image,
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    Button, 
    StyleSheet, 
    StatusBar,
    AsyncStorage,
    ActivityIndicator
} from 'react-native';

import { userLogin } from '../../../APIs/Account';
import { getMobileMenuItems } from '../../../APIs/Modules';

import brand from '../../../Styles/brand'

let fakedMenu = require('../../../Fixtures/Modules')

// create a component
class LoginForm extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            sending: false,
            receiving: false,
            requestStatus: {
                hasError: false,
                message: ""
            },
            userName: '',
            password: '',
            userData: null
        }

    }
    
    componentDidMount() {

        // clear any abandoned keys
        // let keys = ['userEmail', 'userPassword'];
        // AsyncStorage.multiRemove(keys, (err) => {
        //     // do most stuff after removal (if you want)
        // });

        AsyncStorage.getItem('userData').then((data) => {

            console.log("LoginForm userData", data)

            if(data) {
                
                let userData = JSON.parse(data)

                //console.log("userData", JSON.stringify(userData, null, 2))

                this.setState({
                    userName: userData.userName,
                    password: userData.password,
                    userData: userData
                })
            }

        })

    }

    showAlert = (message) => {

        console.log("error message: ", message)

        this.setState({
            sending: false, 
            requestStatus: {
                hasError: true,
                message: message
            }
        })

    }


    //******************************************************************
    // this will pass results back up to Login.js
    //******************************************************************
    onLoginPress = () => {

        // this takes on a new scope inside of the userLogin and getUserLogin callback, so make a copy
        let _this = this

        this.setState({
            sending: true,
            requestStatus: {
                hasError: false,
                message: null
            }
        })

        // AsyncStorage.setItem('userEmail', this.state.email)
        // AsyncStorage.setItem('userPassword', this.state.password)

        console.log("submitting...", this.state.userName, this.state.password)

        let request = {
			userName: this.state.userName, 
			password: this.state.password, 
        }
        

        if(this.state.userName === 'demo') {

            // FAKED for demoing...
            setTimeout(() => {
        
                const FAKE_TOKEN = 'FAKE-ABCD-1234'

                let userData = {
                    token: FAKE_TOKEN,
                    userId: 0,
                    userName: this.state.userName,
                    commonName: "Demo User",
                    password: this.state.password,
                    sites: [ "AAG", "DOHERTY" ]
                }

                // sort before persisting
                userData.sites.sort()

                let keys = [
                    [ 'userData', JSON.stringify(userData) ],
                    [ 'menuItems', JSON.stringify(fakedMenu) ],
                    [ 'selectedSite', userData.sites[0] ]
                ]

                console.log("saving keys", JSON.stringify(keys, null, 2))

                AsyncStorage.multiSet(keys, function(err){

                    _this.setState({
                        sending: false
                    })
                    _this.props.onLoginResponse(userData, userData.sites[0], fakedMenu, null)

                })
                


            }, 1000);

        }
        else {


            // {
            //     "Success": true,
            //     "ErrorMsg": null,
            //     "SecurityToken": "4a739193-80aa-4f42-a5e8-5536ef92ff21",
            //     "Rosnet_User_ID": 26472,
            //     "Browse_User_Name": "dywayne.johnson",
            //     "Common_Name": "Dywayne Johnson",
            //     "My_Entrprise_Id": null,
            //     "Rosnet_Employee": false,
            //     "Sites": [
            //         "ROS",
            //         "BLOOMIN",
            //         "CARLOS",
            //         "SRR",
            //         "DOHERTY",
            //         "AAG",
            //         "AMETRO",
            //         "ROSE",
            //         "ROMULUS",
            //         "ATX",
            //         "TLCANNON",
            //         "NRPFL",
            //         "DYNAPPLE",
            //         "NRP",
            //         "QRC",
            //         "NORTHCOTT",
            //         "DOHERTYFL",
            //         "SLIMCHKNS",
            //         "TINLIZZYS",
            //         "JLP",
            //         "MDO",
            //         "PMCHILIS",
            //         "PMOTB",
            //         "APP",
            //         "PEAK",
            //         "ATEAM",
            //         "SPLATLC",
            //         "DChevys",
            //         "PANAM",
            //         "OTR",
            //         "MRUCHILIS",
            //         "CRGROBIN",
            //         "HGPAN",
            //         "IMSJAMBA",
            //         "JKIHOP",
            //         "CBC",
            //         "AHG",
            //         "JSV",
            //         "KINGSBOWL",
            //         "YFG",
            //         "WILLYS",
            //         "PARRYS",
            //         "JAE",
            //         "CARINOSZEN",
            //         "BKGULF",
            //         "CARMEL",
            //         "WOMACKPOP",
            //         "SRG",
            //         "MOLINOS"
            //     ]
            // }

            // real login request
            userLogin(request, function(err, response){        

                if(err) {
                    console.log("userLogin error", err)
                    _this.showAlert(err.message)

                }
                else {

                    console.log("userLogin success:", response)

                    if(response && response.SecurityToken) {

                        response.Sites.sort()
                        let clientCode = response.Sites[0].toLowerCase()

                        let cookies = "rememberme=" + response.Browse_User_Name + "; clientCode=" + clientCode + "; rosnetToken=" + response.SecurityToken

                        getMobileMenuItems(cookies, function(err, menuItems){
                            
                            if(err) {

                            }
                            else {

                                // rename the FontAwesome icons by removing the fa- preface
                                menuItems.forEach(function(item){
                                    item.icon = item.icon.replace('fa-', '')
                                })

                                let userData = {
                                    token: response.SecurityToken,
                                    userId: response.Rosnet_User_ID,
                                    userName: _this.state.userName, //response.Browse_User_Name,
                                    commonName: response.Common_Name,
                                    password: _this.state.password,
                                    sites: response.Sites
                                }

                                // sort before persisting
                                userData.sites.sort()
                                // default the first one as selected
                                let selectedSite = ''
                                if(userData.sites.length > 0) {
                                    selectedSite = userData.sites[0]
                                }


                                let keys = [
                                    [ 'userData', JSON.stringify(userData) ],
                                    [ 'menuItems', JSON.stringify(menuItems) ],
                                    [ 'selectedSite', selectedSite ]
                                ]

                                console.log("saving keys", JSON.stringify(keys, null, 2))

                                AsyncStorage.multiSet(keys, function(err){

                                    _this.setState({
                                        sending: false
                                    })
                                    _this.props.onLoginResponse(userData, selectedSite, menuItems, null)

                                })


                            }
                        })






                    }
                    else {

                        _this.showAlert("Invalid login request. Please check your email address and password and try again.")

                    }
                        

                }

                _this.setState({
                    sending: false
                })

            })

        }




    }

    handleForgotPasswordPress = () => {

        if(!this.state.sending) {
            this.props.onForgotPassword()
        }

    }
    
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <TextInput style={styles.input} 
                            autoCapitalize="none" 
                            onSubmitEditing={() => this.passwordInput.focus()} 
                            autoCorrect={false} 
                            keyboardType='email-address' 
                            returnKeyType="next" 
                            placeholder='Email Address'
                            value={this.state.userName}
                            onChangeText={(text) => this.setState({userName: text})}
                />

                <TextInput style={styles.input}   
                           returnKeyType="go" ref={(input)=> this.passwordInput = input} 
                           placeholder='Password' 
                           secureTextEntry
                           value={this.state.password}
                            onChangeText={(text) => this.setState({password: text})}
                />

              {this.state.sending &&
              <View style={{ marginTop: 10, marginBottom: 10 }} >
                <ActivityIndicator size="large" color={brand.colors.primary} />
                </View>
              }


                {!this.state.sending && this.state.requestStatus.hasError &&
                    <View style={{ 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        marginBottom: 15,
                        marginTop: 10
                    }}>
                        <Text>{this.state.requestStatus.message}</Text>
                    </View>
                }

                <TouchableOpacity disabled={this.state.sending} 
                    style={ this.state.sending ? styles.buttonDisabledContainer   : styles.buttonContainer }
                    onPress={this.onLoginPress}>
                    <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity> 
                <View>
                    <Text 
                        disabled={this.state.sending} 
                        style={styles.forgotPassword} 
                        onPress={this.handleForgotPasswordPress}>
                        Forgot password?
                    </Text>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
     padding: 20
    },
    input:{
        height: 40,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        padding: 10,
        color: brand.colors.primary,
        borderColor: brand.colors.silver, 
        borderWidth: 1,
        borderRadius: 5
    },
    buttonContainer:{
        backgroundColor: brand.colors.primary,
        paddingVertical: 15,
        borderRadius: 30
    },
    buttonDisabledContainer:{
        backgroundColor: brand.colors.primary,
        opacity: .5,
        paddingVertical: 15,
        borderRadius: 30
    },
    buttonText:{
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }, 
    loginButton:{
        backgroundColor:  '#2980b6',
        color: '#fff'
    },
    forgotPassword:{
        color: brand.colors.secondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20
    }
   
});

//make this component available to the app
export default LoginForm;