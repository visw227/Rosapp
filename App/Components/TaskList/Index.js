import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    FlatList,
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
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import brand from '../../Styles/brand'
import Styles from './Styles'
import appConfig from '../../app-config.json'
import img from '../../Images/rosnet-logo1.png'
import blueBg from '../../Images/blue-screen.jpeg'
import greenBg from '../../Images/green-screen.jpg'





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
            receiving: false,
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

   isTasklistComplete = (arr) => {
    
    if(arr.TasklistSteps && arr.TasklistSteps.length > 0) {
        
        var color = blueBg
        index = 0
        arr.TasklistSteps.forEach(element => {
            if (!element.Is_Completed) 
            {
                index ++
            }
          
           if(index > 0) {
               
               color = blueBg
           }
           else {
           
    
               color = greenBg
           }
           
        });
    }
    return color

   }

    render() {

    /******************************NOT being used but might be helpful later**************************************/
        const cards = []
        if(this.state.data.length > 0) {
          // Returing an array object suitable for List / section list
          for (i=0; i < this.state.data.length ; i++ ) {
            opts = Object.assign(
             {},{  text:this.state.data[i].Tasklist_Title ,
                    //note : this.state.data[i].Tasklist_ID,
                      name : this.state.data[i].Tasklist_Title,
                    steps : this.state.data[i].TasklistSteps  }
            )
            cards.push(opts) 
         }

         //******************************************************************/

        }
        
        if (this.state && this.state.data && this.state.data.length > 0)
        
        {  
            
            return (

                    <ScrollView
                    style={{ backgroundColor: '#ffffff' }}
    
                    refreshControl={
    
                    <RefreshControl
                        refreshing={this.state.receiving}
                        onRefresh={this.getTaskLists}
                        tintColor={brand.colors.primary}
                        title="Loading"
                        titleColor={brand.colors.primary}
                        colors={['#ff0000', '#00ff00', '#0000ff']}
                        progressBackgroundColor="#ffffff"
                    />
                    }
                    
                  >
                    
                    <View style={{margin:12,marginTop:'20%'}}>
                      <DeckSwiper
                      
                      dataSource={this.state.data}
                        renderItem={item =>
                          <Card style={{ elevation: 30}}>
                            <CardItem>
                              <Left>
                                <Thumbnail small style ={{backgroundColor:brand.colors.primary}}source={img} />
                                <Body>
                                  <Text style={{color:brand.colors.primary,fontSize:20,fontWeight:'bold'}}>{item.Tasklist_Title}</Text>
                               </Body>
                              </Left>
                            </CardItem>
                            <CardItem cardBody  >
                               
                              <Image style={{ height: 300, flex: 1 }} source={this.isTasklistComplete(item)}/>
                           
                            
                   {item && item.TasklistSteps ? <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                        <FlatList 
                        data={item.TasklistSteps}
                        renderItem={({item, index, section}) => 
                      
                             <ListItem onPress={()=>console.log('step pressed')}
                             hideChevron
                              key={item.Step_ID }

                              //icon={<Ionicon name={'md-radio-button-on'} size={22} color={brand.colors.white} />}
                              title={<View style={{flexDirection:'row'}}>
                                  <View style={{flexDirection :'row',justifyContent:'space-between',alignItems:'flex-start',alignContent:'flex-end'}}>
                                  <Text style = {{color:brand.colors.white,fontWeight:'bold',fontSize:20,marginRight:60}} >{item.Step_Title}</Text>
                                  </View>
                                  <View style={{flexDirection :'row',justifyContent:'space-between',alignItems:'flex-end',alignContent:'flex-end'}}style={{marginLeft:'90%',position:'absolute'}}>
                                 {
                                     item.Is_Completed ? <FontAwesome name={'check-square-o'} size={22} color='#00FF00' /> : 
                                     <FontAwesome name={'square-o'} size={22} color='#00FF00' />
                                 } 
                                  </View>
                                  
                                  </View>}
                          />
                      
                      }
                     
                  /> 
                       </ScrollView>
                       : 
                       <Text style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
                           No steps added</Text> }

                            </CardItem>
                            <CardItem>
                              <Icon name="clock" style={{ color: brand.colors.secondary }} />
                              <Text>{item.Tasklist_Time_Formatted}</Text>
                              
                              <View style={{flexDirection:'column',marginLeft:'80%',position:'absolute'}}>
                              <Text style={{color:brand.colors.primary}}>
                                  {this.state.data.indexOf(item)+1} of {this.state.data.length} → 
                                 
                              </Text>
                              <Text style={{marginTop:'25%',marginLeft:'20%',position:'absolute',color:brand.colors.gray}}>
                                  swipe 
                              </Text>
                              </View>
                             
                            
                            </CardItem>
                          </Card>
                        }
                      />
                    </View>
                    <Text>
                        
                    </Text>
                  </ScrollView>
    
                    )
            } 
            else {
            return (
                <View>
                    <Text style={{color:brand.colors.primary,textAlign:"center"}}>
                         No TaskList added or published
                         </Text>
                </View>
            )
            }// end return




        } // end render

}



//make this component available to the app
export default TaskListScreen;