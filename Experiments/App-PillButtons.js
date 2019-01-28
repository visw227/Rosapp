
import React from 'react';
import { StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, RefreshControl } from 'react-native';

import PillButtons from '../App/Components/ReusableComponents/PillButtons'

import { getUserProfile } from '../App/Services/Account';
import { getEmployeeRoles } from '../App/Services/Employee';

import brand from '../App/Styles/brand'

let roleData = require('../App/Fixtures/EmployeeRoles')

// hide warnings for now...
console.disableYellowBox = true;

class Test extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            items: []
        }

    }

    componentWillMount () {

        let items = []
        roleData.forEach(function(role){
            //console.log("pushing", role)
            items.push({ id: role.id, label: role.desc })
        })

        //console.log("items", items)

        this.setState({
            items: items
        })

    }



    handlePillButtonSelection = (item) => {
        console.log("pill changed: ", item)
        this.setState({
            selectedItem: item
        })
    }


    render() {
        return (

            <ScrollView
                style={{ backgroundColor: '#ffffff' }}
                refreshControl={

                <RefreshControl
                    refreshing={false}
                    onRefresh={this.loadData}
                    tintColor={brand.colors.primary}
                    title="Loading"
                    titleColor={brand.colors.primary}
                    //colors={['#ff0000', '#00ff00', '#0000ff']}
                    progressBackgroundColor="#ffffff"
                />
                }
                
            >


            <View style={{ flex: 1,  marginTop: 50 }}>
                

                <View style={{
                        marginTop: 30,
                        marginBottom: 20,
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                    <Text style={{ fontSize: 18, color: brand.colors.secondary }}>Select a Location</Text>
                </View>


                <View style={{
                        marginTop: 30,
                        marginBottom: 20,
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                    <Text style={{ fontSize: 18, color: brand.colors.secondary }}>Select a Role</Text>
                </View>
                
                {this.state && this.state.items &&
                <PillButtons 
                    items={this.state.items} 
                    onSelection={this.handlePillButtonSelection}
                />
                }
                {this.state && this.state.selectedItem &&
                    <View style={{
                        marginTop: 30,
                        flex: 1,
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <Text>Selected Id: {this.state.selectedItem.id}</Text>
                        <Text>Selected Label: {this.state.selectedItem.label}</Text>
                    
                    </View>
                }
            </View>

        </ScrollView>
        );
    }

}



export default Test