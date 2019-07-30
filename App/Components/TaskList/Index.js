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

import { Container, Header,  DeckSwiper, Card, CardItem, Thumbnail, Left, Body, Icon , Content, Accordion} from 'native-base';
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
            data : {},
            gridView  : true,
            listView :false,
            doneTL :['0']
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
          }, () => {
            completedTL = []

            _this.state && _this.state.data && _this.state.data.forEach(element => {
                 if(element.TasklistSteps && element.TasklistSteps.length > 0) {
                       
                   element.TasklistSteps.forEach(e => {
                

                       index = 0
                       if(e.Is_Completed){
                           index ++;
                       }
                     
                       if (index == element.TasklistSteps.length) {
                           completedTL.push(element.Tasklist_ID)
                       }
                      
                   })
       
                 }

             })
           
             _this.setState({
                 doneTL : completedTL
             },()=> console.log('<<done',_this.state.doneTL))
          } )
  
            
        }
  
      })

      

   }
   
    

  

   _renderContent = (item) => {
      
       return (
        <FlatList 
        data={item.TasklistSteps}
        
        //keyExtractor={(item, index) => item.Tasklist_Title}
        renderItem={({item, index, section}) => 
      
             <ListItem onPress={()=>console.log('step pressed')}
             hideChevron
              key={item.Step_ID }

              //icon={<Ionicon name={'md-radio-button-on'} size={22} color={brand.colors.white} />}
              title={<View style={{flexDirection:'row'}}>
                  <View style={{flexDirection :'row',justifyContent:'space-between',alignItems:'flex-start',alignContent:'flex-end'}}>
                  <Text style = {{color:brand.colors.white,fontWeight:'bold',fontSize:14,marginRight:60}} >{item.Step_Title}</Text>
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
       )
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

        _renderHeader = (item, expanded) => {
            _this = this
             return (
                 
                 <View style={{
                   flexDirection: "row",
                   padding: 10,
                   justifyContent: "space-between",
                   alignItems: "center" ,
                   backgroundColor: this.state.doneTL.includes(item.Tasklist_ID) ? brand.colors.success : brand.colors.secondary }}>
                 
                   {expanded
                     ? <View style={{flex:1,flexDirection:'row', justifyContent: 'space-between'}}>
                         <View style={{flex:1,flexDirection:'column-reverse', justifyContent: 'flex-start'}}>
                         <Text style={{ fontWeight: 'bold',fontSize:20,color:brand.colors.warning}}>
                     {" "}{item.Tasklist_Title} </Text>
                     <Text style={{ fontWeight: 'bold',fontSize:12,color:brand.colors.warning,margin:2}}>
                     {" "}{item.Tasklist_Time_Formatted} </Text>
                   </View>
                   <Icon style={{ fontSize: 20}} name="remove-circle" /></View>
                     : <View style={{flex:1,flexDirection:'row', justifyContent: 'space-between'}}>
                     <View style={{flex:1,flexDirection:'column-reverse', justifyContent: 'flex-start'}}>
                     <Text style={{ fontWeight: 'bold',fontSize:20,color:brand.colors.white}}>
                 {" "}{item.Tasklist_Title} </Text>
                 <Text style={{ fontWeight: 'bold',fontSize:12,color:brand.colors.white,margin:2}}>
                 {" "}{item.Tasklist_Time_Formatted} </Text>
               </View>
               <Icon style={{ fontSize: 20}} name="remove-circle" /></View>}
                 </View>
               );
         
      
       }

    /******************************NOT being used but might be helpful later**************************************/
        const cardss = []
        if(this.state.data.length > 0) {
          // Returing an array object suitable for List / section list
          for (i=0; i < this.state.data.length ; i++ ) {
            opts = Object.assign(
             {},{  text:this.state.data[i].Tasklist_Title ,
                    //note : this.state.data[i].Tasklist_ID,
                      title : this.state.data[i].Tasklist_Title,
                      steps : this.state.data[i].TasklistSteps
                      }
            )
            cardss.push(opts) 
         }

         //******************************************************************/

        }
        
        if (this.state.gridView && this.state && this.state.data && this.state.data.length > 0)
        
        {  
            
            return (

                    <ScrollView
                    style={{ backgroundColor: brand.colors.primary }}
    
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

                    <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row',margin:5}}>
                      <Ionicon name={'md-grid'} style={{margin:5}} size={35} color= {this.state.gridView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({gridView:true , listView:false})} />
                      <Ionicon name={'ios-list'} style={{margin:5}} size={35} color= {this.state.listView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({gridView:false , listView:true})} />

                  </View>
                      
                    
                    <View style={{margin:12,marginTop:'20%'}}>
                      <DeckSwiper
                      style={{backgroundColor:brand.colors.danger,borderWidth:2}}
                      dataSource={this.state.data}
                        renderItem={item =>
                          <Card style={{ elevation: 30,borderColor:brand.colors.white,borderWidth:5}}>
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
            else if (this.state.listView &&  this.state.doneTL && this.state.data && this.state.data.length > 0) {
                return (
                    <ScrollView
                    style={{ backgroundColor: brand.colors.primary }}
    
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
                  <View style={{flex:1,justifyContent:'flex-end',flexDirection:'row',margin:5}}>
                      <Ionicon name={'md-grid'} style={{margin:5}} size={35} color= {this.state.gridView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({gridView:true , listView:false})} />
                      <Ionicon name={'ios-list'} style={{margin:5}} size={35} color= {this.state.listView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({gridView:false , listView:true})} />

                  </View>
                    <Container style={{backgroundColor:brand.colors.primary,margin:12,marginTop:'20%'}}>
       
                        <Content padder>
                        <Accordion dataArray={this.state.data} expanded={0}expandMultiple
                        renderContent={this._renderContent}
                         renderHeader={_renderHeader}/>
                        </Content>
                        </Container>
                    </ScrollView>
                                )
                            }  
                            else {
                            return (
                                <View>
                                    <Text style={{color:brand.colors.primary,textAlign:"center",marginTop:'40%'}}>
                                        No TaskList added or published
                                        </Text>
                                </View>
                            )
                            }// end return

           




        } // end render

}



//make this component available to the app
export default TaskListScreen;