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

import { Container, Header,  DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Icon } from 'native-base';
import { GetTaskLists } from '../../Services/TaskList';

import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
import brand from '../../Styles/brand'
import Styles from './Styles'
import appConfig from '../../app-config.json'
import img from '../../Images/logo-lg-white-square.png';
import { CardList } from 'react-native-card-list';



class TaskListScreen extends React.Component {

    static navigationOptions = (navigate) => ({

        //title: typeof(navigate.navigation.state.params)==='undefined' || typeof(navigate.navigation.state.params.title) === 'undefined' ? 'TaskList': navigate.navigation.state.params.title,
        title: "Tasklist Dashboard",

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

    constructor(props) {
        super(props);
  
        this.state = {
            alertMessage : '',
            data : {}
    }
      }
  

   componentDidMount () {

    this.props.navigation.addListener('willFocus', this.getTaskLists)


   }

   getTaskLists = () => {

    _this = this

    let userData = _this.props.screenProps.state.userData
    let client  = _this.props.screenProps.state.selectedClient

    let request = {
        token : userData.token,
        client : client,
        userName : userData.userName,
    }

    GetTaskLists (request ,function(err,resp) {
       

        if (err){
  
          console.log ('Error TAsklist',err )
        }
  
        else if (resp.length < 1) {
          //console.log('Alert message is logged')
         _this.state && _this.setState({alertMessage : 'No Tasklists created or published'}) 
        }
        else {
  
          console.log('response',resp)
  
          _this.setState ({
            data : resp
          },()=> console.log('<<data',_this.state.data))
  
            
        }
  
      })

      

  
   }

    render() {

const cards = [
  
  ]
  const cardss = [
    {
      text: 'Card One',
      name: 'One',
      //image: require('./img/swiper-1.png'),
    },
    {
        text: 'Card two',
        name: 'One',
        //image: require('./img/swiper-1.png'),
      }, {
        text: 'Card three   ',
        name: 'One',
        //image: require('./img/swiper-1.png'),
      },
  ];
  if(this.state.data.length > 0) {
    // Returing an array object suitable for List / section list
    for (i=0; i < this.state.data.length ; i++ ) {
      opts = Object.assign(
       {},{  text:this.state.data[i].Tasklist_Title ,
              //note : this.state.data[i].Tasklist_ID,
                name : this.state.data[i].Tasklist_Title }
      )
      cards.push(opts) 
   }
  }
  
  console.log('<<Cards',cards)
  console.log('<<Cards',cardss)
        // const cards = [
        //     {
        //       text: 'Card One',
        //       name: 'One',
        //       image: img,
        //     },
        //     {
        //         text: 'Card two',
        //         name: 'two',
        //         image: img,
        //       },
        //       {
        //         text: 'Card three',
        //         name: 'three',
        //         image: img,
        //       },
        //   ];
        //     if(this.state && this.state.data) {

        //         return (

        //             <View style={styles.container}>
        //                 <CardList cards={cards} />
        //         </View> )
        //     }
        //    else {
        //        return (
        //            <View>

        //            </View>
        //        )
        //    }
            if (cards.length > 0) {
                return( <Container>
                    <Header />
                    <View>
                      <DeckSwiper
                        dataSource={cards}
                        renderItem={item =>
                          <Card style={{ elevation: 4 }}>
                            <CardItem>
                              <Left>
                                {/* <Thumbnail source={item.image} /> */}
                                <Body>
                                  <Text>{item.text}</Text>
                                  <Text note>NativeBase</Text>
                                </Body>
                              </Left>
                            </CardItem>
                            <CardItem cardBody>
                              {/* <Image style={{ height: 300, flex: 1 }} source={item.image} /> */}
                            </CardItem>
                            <CardItem>
                              <Icon name="heart" style={{ color: '#ED4A6A' }} />
                              <Text>{item.name}</Text>
                            </CardItem>
                          </Card>
                        }
                      />
                    </View>
                  </Container>)  
            } 
            else {
                return (
                    <View>
                        
                    </View>
                )
            }

                // end return




        } // end render

}



    
//make this component available to the app
export default TaskListScreen;