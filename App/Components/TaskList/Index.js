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
    Linking,
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

import { Container, Header,   Card, CardItem, Thumbnail, Left, Body, Icon , Content, Accordion} from 'native-base';
import DeckSwiper from 'react-native-deck-swiper'
import { GetTaskLists,UpdateStep } from '../../Services/TaskList';

import { List, ListItem, Avatar } from 'react-native-elements'
import Ionicon from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


import FontAwesome from 'react-native-vector-icons/FontAwesome'
import brand from '../../Styles/brand'
import Styles from './Styles'
import appConfig from '../../app-config.json'
import img from '../../Images/rosnet-logo1.png'
import blueBg from '../../Images/blue-screen.jpeg'
import greenBg from '../../Images/green-screen.jpg'
import grayBg from '../../Images/gray-screen.jpg'






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
            onPress={() => navigate.navigation.toggleDrawer() }
        />,

        headerRight : navigate.navigation.getParam('createTasklist')

    })

    constructor(props) {
        super(props);
  
        this.state = {
            receiving: false,
            alertMessage : '',
            data : {},
            cardView  : true,
            stackView :false,
            indexValue : 0,
            doneTL :['0'],
            fetching : false
    }
      }
  

   componentDidMount () {

    this.props.navigation.addListener('willFocus', this.getTaskLists)

   }

  

    
   
   createTasklist = () => {

    url = "http://" + this.props.screenProps.state.selectedClient + "."+ appConfig.DOMAIN  + "/Tasklist/CreateTasklist/Mobile"
     source = {
      uri: url,
      headers: {
        "managerAppToken":  this.props.screenProps.state.userData.token
      }
    }

    return (

      <MaterialCommunityIcons name = {'plus-outline'} style={{margin:5}} size={25} color= { brand.colors.white } onPress ={() => this.props.navigation.navigate('TaskListDetail',{source})} />
    )

   }
    

                  
  


   getTaskLists = () => {

    _this = this

    _this.props.navigation.setParams({createTasklist : this.createTasklist()})

    let userData = _this.props.screenProps.state.userData
    let client  = _this.props.screenProps.state.selectedClient

    let request = {
        token : userData.token,
        client : client,
        userName : userData.userName,
    }

    this.setState({
      fetching : true
    })

    GetTaskLists (request ,function(err,resp) {
       

        if (err){
  
          console.log ('Error TAsklist',err )
        }
  
        else if (resp.length < 1) {
         
         _this.state && _this.setState({alertMessage : 'No Tasklists created or published',fetching:false}) 
        }
        else {
  
          console.log('response',resp)

          if(_this.state.tasklistId && _this.state.cardView) {

            _this.setState ({
              data : resp,
              fetching:false
            }, () => {

              indexValue = 0

              _this.state.data.forEach(e => {
                
                if(e.Tasklist_ID === _this.state.tasklistId.Tasklist_ID){
                  indexValue = _this.state.data.indexOf(e)
  
              }
             
            })
                        
            _this.swiper.jumpToCardIndex(indexValue) // This is important to keep the Tasklist deck unchanged on clicking the checkbox--
            
            
          }
            )
         
          }

          else if(_this.state.stackViewTasklistId && _this.state.stackView) {

            _this.setState ({
              data : resp,
              fetching:false
            }, () => {

              indexValue = 0

              _this.state.data.forEach(e => {
                
                if(e.Tasklist_ID === _this.state.stackViewTasklistId.Tasklist_ID){
                  indexValue = _this.state.data.indexOf(e)

                  console.log('index -- value',indexValue)
  
              }
             
            })

            _this.setState({indexValue})

            _this.accordion.setSelected(indexValue)
                        
            //_this.swiper.jumpToCardIndex(indexValue) // This is important to keep the Tasklist deck unchanged on clicking the checkbox--
            
            
          }
            )
         
          }
            else {

              tasklistId = resp[0]

              stackViewTasklistId = resp[0]

              _this.setState ({
                data : resp,
                tasklistId : tasklistId,
                stackViewTasklistId : stackViewTasklistId,
                fetching : false
              }, () => {

                indexValue = 0

                _this.state.cardView && _this.state.data.forEach(e => {
                  
                  if(e.Tasklist_ID === tasklistId.Tasklist_ID){
                    indexValue = _this.state.data.indexOf(e)
    
                }
               
              })

              _this.state.stackView && _this.state.data.forEach(e => {
                  
                if(e.Tasklist_ID === stackViewTasklistId.Tasklist_ID){
                  indexValue = _this.state.data.indexOf(e)
  
              }
             
            })

            
            _this.setState({indexValue})
            
            _this.state.cardView && _this.swiper.jumpToCardIndex(indexValue)  // This is important to keep the Tasklist deck unchanged on clicking the checkbox--

            _this.state.stackView && _this.accordion.setSelected(indexValue)

                
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
                 })
              } )

            }
 
        }
  
      })

   }
   
    

 
   _renderContent = (item) => {
      
       return (
        <FlatList 
        data={item.TasklistSteps}
        keyExtractor={(item, index) => String(index)}
        //keyExtractor={(item, index) => item.Tasklist_Title}
        renderItem={({item, index, section}) => 
      
             <ListItem onPress={()=>this.runTasklistStep(item)}
             hideChevron
             key={String(index)}

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

   onSwiped = (index) => {
     
    reqCard = this.state.data[index+1] ? this.state.data[index+1] : this.state.data[0]
    this.setState({
      tasklistId : reqCard
    },()=>console.log('reqCard',this.state.tasklistId))

   }

   onOpened = (index) => {
     console.log ('open index',index)
    reqList = index ? index : this.state.data[0]
    this.setState({
      stackViewTasklistId : reqList
    },()=>console.log('reList',this.state.stackViewTasklistId))

   }

   

   runTasklistStep = (step) => {

    _this = this
    
    _this.setState({
      stepId : step.Step_ID,
      checked : !step.Is_Completed
    })


    !step.Is_Completed && step.Step_Type_Name === "External Site"? Linking.openURL(step.URL).catch((err) => console.error('An error occurred', err)):step
    let env = appConfig.DOMAIN
    const hideSiteNav = `
    // alert('hello')
    let x = document.getElementsByTagName('nav')
    if(x.length > 0) {
      x[0].style.display = "none";
    }
  `;
    request = {
          Step_ID  : step && step.Step_ID !== null && step.Step_ID,
          Tasklist_ID  : step.Tasklist_ID,
          Step_Title  : step.Step_Title,
          Step_Type_ID  : step.Step_Type_ID,
          Step_Type_Name : step.Step_Type_Name,
          IsPublished  : step.IsPublished,
          Is_Completed  : !step.Is_Completed,
          Browse_User_ID  : step.Browse_User_ID,
          Browse_Full_Name  : step.Browse_Full_Name,
          CompletedByName  : step.CompletedByName,
          Completed_Date  : step.Completed_Date,
          Completed_Date_TZ : step.Completed_Date_TZ, 
          Sort_Order  : step.Sort_Order,
          Step_Description  : step.Step_Description,
          Function_ID  : step.Function_ID,
          Function_Name  : step.Function_Name,
          LocsNotDone   : step.LocsNotDone,
          Menu_Function_FileName  : step.Menu_Function_FileName,
          Menu_Function_Name  : step.Menu_Function_Name,
          hasAccess  : step.hasAccess,
          SQLToFind  : step.SQLToFind,
          SQLValidLocs  : step.SQLValidLocs,
          SQLToCheck  : step.SQLToCheck,
          StepNotApplicable  : step.StepNotApplicable,
          TasklistStepDetails  : step.TasklistStepDetails,
          URL  : step.URL,
          Report_Menu_Function_ID  : step.Report_Menu_Function_ID,
          Report_Name   : step.Report_Name,
          MenuFunctionhref  : step.MenuFunctionhref,
          Report_Saved_Settings_ID  : step.Report_Saved_Settings_ID,
          Destination_Flag  : step.Destination_Flag,
          Output_Format  : step.Output_Format,
          FunctionParameters  : step.FunctionParameters
    } 

    

    if (step.Step_Type_ID === 4) {
      // Do some more complex stuff. Never uncheck manually.
      if (step.LocsNotDone.length == 1) { // Single location-we can link directly to the function.
        
        url = "http://" + this.props.screenProps.state.selectedClient + "."+ env  + step.LocsNotDone[0].Location_Link
        let source = {
          uri: url,
          headers: {
            "managerAppToken":  this.props.screenProps.state.userData.token
          }
        }
        _this.props.navigation.navigate('TaskListDetail',{source})
      } else {
        link = '/Tasklist/RunTasklist?Tasklist_ID=' + step.Tasklist_ID+'&Step_ID='+step.Step_ID
        url = "http://" + this.props.screenProps.state.selectedClient + "."+ env  + link
        let source = {
          uri: url,
          headers: {
            "managerAppToken":  this.props.screenProps.state.userData.token
          }
        }
        _this.props.navigation.navigate('TaskListDetail',{source})

      }
    } 
    // else if (step.Is_Completed())
    //   // Checkable tasks: If was checked, uncheck it.
    //   step.Is_Completed(false);

   
      // Checkable tasks that are not checked. Do action depending on step type and complete.
      if (step && step.Step_Type_ID === 2){

        _this = this
      
        UpdateStep (_this.props.screenProps.state.selectedClient,_this.props.screenProps.state.userData.token,request ,
            function(err,resp) {
      
          if (err){
    
            console.log ('Error TAsklist',err )
          }

          else {
              console.log('succes update',resp)
          }

        }) 
        _this.getTaskLists()
        //!step.Is_Completed && Linking.openURL(step.URL).catch((err) => console.error('An error occurred', err))
      }
       if (step && step.Step_Type_ID === 3) {
      if (step.Output_Format && step.Output_Format != "" && step.Report_Saved_Settings_ID) {
        if (step.hasAccess) {
          var Output_Format = step.Output_Format.split(",", 1);
          link ='/report/exec/' + step.Report_Saved_Settings_ID + '?outputformat=' + Output_Format
          url = "http://" + this.props.screenProps.state.selectedClient + "."+ env  + link
          let source = {
            uri: url,
            headers: {
              "managerAppToken":  this.props.screenProps.state.userData.token
            }
          }
         !step.Is_Completed && _this.props.navigation.navigate('TaskListDetail',{source})   

          UpdateStep (_this.props.screenProps.state.selectedClient,_this.props.screenProps.state.userData.token,request ,
              function(err,resp) {
        
            if (err){
      
              console.log ('Error TAsklist',err )
            }
  
            else {
                console.log('succes update',resp)
            }
  
          }) 
        

          this.getTaskLists()
          //this._deckSwiper._root.swipeRight()
        }
      }
        // This doesn't work in iframes. Sigh.
        //else
        //  prettyAlert("You do not have the appropriate permissions to access report '" + step.Report_Name + "'. Please contact your Admin to request access.");
      }
      if (step && step.Step_Type_ID === 1) {

        UpdateStep (_this.props.screenProps.state.selectedClient,_this.props.screenProps.state.userData.token,request ,
          function(err,resp) {
    
        if (err){
  
          console.log ('Error TAsklist',err )
        }
  
        else {
            console.log('succes update',resp)
        }
  
      }) 
       _this.getTaskLists()
      }
     
   
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
                   backgroundColor: this.state.doneTL.includes(item.Tasklist_ID) ? brand.colors.success : brand.colors.white }}>
                 
                   {expanded
                     ? <View style={{flex:1,flexDirection:'row', justifyContent: 'space-between'}}>
                         <View style={{flex:1,flexDirection:'column-reverse', justifyContent: 'flex-start'}}>
                         <Text style={{ fontWeight: 'bold',fontSize:20,color:brand.colors.warning}}>
                     {" "}{item.Tasklist_Title} </Text>
                     <Text style={{ fontWeight: 'bold',fontSize:12,color:brand.colors.warning,margin:2}}>
                     {" "}{item.Tasklist_Time_Formatted} </Text>
                   </View>
                   <Icon style={{ fontSize: 20}} name="remove-circle" />
                   </View>
                     : <View style={{flex:1,flexDirection:'row', justifyContent: 'space-between'}}>
                     <View style={{flex:1,flexDirection:'column-reverse', justifyContent: 'flex-start'}}>
                     <Text style={{ fontWeight: 'bold',fontSize:20,color:brand.colors.primary}}>
                 {" "}{item.Tasklist_Title} </Text>
                 <Text style={{ fontWeight: 'bold',fontSize:12,color:brand.colors.primary,margin:2}}>
                 {" "}{item.Tasklist_Time_Formatted} </Text>
               </View>
               <Icon style={{ fontSize: 20}} name="add-circle" /></View>}
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
        
        if (this.state.cardView && this.state && this.state.data && this.state.data.length > 0)
        
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
                      <MaterialCommunityIcons name={'cards-outline'} style={{margin:5}} size={35} color= {this.state.cardView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({cardView:true , stackView:false})} />
                      <MaterialCommunityIcons name={'layers-outline'} style={{margin:5}} size={35} color= {this.state.stackView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({cardView:false , stackView:true})} />

                  </View>
                      
                  {this.state.fetching &&
                  <View>
            <View style={{ alignItems : 'center',marginTop: 45, justifyContent : 'space-between'  }} >
                {/* <ActivityIndicator size="large" color={'#ffffff'} /> */}
                <Text style={{color:brand.colors.white,textAlign:'center'}}> Refreshing.... </Text>
            </View>
             <Text style={{color:brand.colors.white,textAlign:'center',marginTop:10}}> Refresh taking too long? Scroll down to refresh quickly</Text>
                    </View>
            }

                    
                    <View style={{margin:2,marginTop:'-3%'}}>
       
                      <DeckSwiper
                      style={{backgroundColor:brand.colors.danger,borderWidth:2}}
                      ref={swiper => {
                        this.swiper = swiper;
                      }} 
                      infinite = {true}
                      //cardIndex= {this.state.item  ? this.state.data.indexOf(this.state.item) : 0}
                      showSecondCard = {true}
                      stackSize = {this.state.data.length}
                      onSwiped = {(i)=>this.onSwiped(i)}
                      verticalSwipe = {false}
                      useViewOverflow = {false}
                      cards={this.state.data}
                      renderCard={item =>
                          <Card style={{ elevation: 30,borderColor:brand.colors.white,borderWidth:5}}>
                            <CardItem>
                              <Left>
                                <Thumbnail small style ={{backgroundColor:brand.colors.primary}}source={img} />
                                <Body>
                                  
                                  <Text style={{color:brand.colors.primary,fontSize:20,fontWeight:'bold'}}
                                  onPress = {() => this.props.navigation.navigate('TaskListDetail',{source: {uri: "http://" + this.props.screenProps.state.selectedClient + "."+ appConfig.DOMAIN +"/Tasklist/RunTasklist?Tasklist_ID="+item.Tasklist_ID,
                                  headers: {
                                    "managerAppToken":  this.props.screenProps.state.userData.token
                                  }}})
                                }
                                  >
                                  {item.Tasklist_Title}
                                  </Text>
                               </Body>
                              </Left>
                            </CardItem>
                            <CardItem cardBody  >
                               
                              <Image style={{ height: 300, flex: 1 }} source={this.isTasklistComplete(item)}/>
                           
                            
                   {item && item.TasklistSteps ? <ScrollView style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}>
                     
                        <FlatList 
                        data={item.TasklistSteps}
                        keyExtractor={(item, index) => String(index)}
                        
                        renderItem={({item, index, section}) => 
                               
                            
                              
                             <ListItem onPress={()=>this.runTasklistStep(item)}
                             hideChevron
                             key={String(index)}


                              //icon={<Ionicon name={'md-radio-button-on'} size={22} color={brand.colors.white} />}
                              title={<View style={{flexDirection:'row'}}>
                                  <View style={{flexDirection :'row',justifyContent:'space-between',alignItems:'flex-start',alignContent:'flex-end'}}>
                                  <Text style = {{color:brand.colors.white,fontWeight:'bold',fontSize:20,marginRight:60}} >{item.Step_Title}</Text>
                                  </View>
                                  <View style={{flexDirection :'row',justifyContent:'space-between',alignItems:'flex-end',alignContent:'flex-end'}}
                                  style={{marginLeft:'90%',position:'absolute'}}>
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
                              
                              <View style={{flexDirection:'column',marginLeft:'77%',position:'absolute'}}>
                              <Text style={{color:brand.colors.primary}}>

                                  {this.state.data.indexOf(item)+1} of {this.state.data.length} → 
                                 
                              </Text>
                              <Text style={{marginTop:'25%',marginLeft:'30%',position:'absolute',color:brand.colors.gray}}>
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
            else if (this.state.stackView &&  this.state.doneTL && this.state.data && this.state.data.length > 0) {
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
                      <MaterialCommunityIcons name={'cards-outline'} style={{margin:5}} size={35} color= {this.state.cardView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({cardView:true , stackView:false})} />
                      <MaterialCommunityIcons name={'layers-outline'} style={{margin:5}} size={35} color= {this.state.stackView ? brand.colors.white : brand.colors.gray} onPress ={()=>this.setState({cardView:false , stackView:true})} />

                  </View>
                    <Container style={{backgroundColor:brand.colors.primary,margin:12,marginTop:'20%'}}>
                        {/* {console.log('index value',this.state.indexValue)} */}
                        <Content padder>
                        <Accordion dataArray={this.state.data} expanded = {this.state.indexValue}
                        ref={accordion => {
                          this.accordion = accordion;
                        }}
                       
                        renderContent={this._renderContent}
                        onAccordionOpen={(e) => this.onOpened(e)}
                         renderHeader={_renderHeader}/>
                        </Content>
                        </Container>
                    </ScrollView>
                                )
                            }  
                            else {
                            return (
                                <View>
                                {this.state.fetching ?
                                  <View style={{ marginLeft :'36%',marginTop: '50%', marginBottom: 10 , position: 'absolute' }} >
                                      <ActivityIndicator size="large" color={'#000000'} />
                                  </View> :
                                  
                                    <Text style={{color:brand.colors.primary,textAlign:"center",marginTop:'40%'}}>
                                        No TaskList added or published
                                        </Text>
                                               }
                                </View>
                            )
                            }// end return

           




        } // end render

}



//make this component available to the app
export default TaskListScreen;