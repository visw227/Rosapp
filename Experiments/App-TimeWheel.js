
import React from 'react';
import { StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, RefreshControl, Picker } from 'react-native';

import PillButtons from '../App/Components/ReusableComponents/PillButtons'

import { getUserProfile } from '../App/APIs/Account';
import { getEmployeeRoles } from '../App/APIs/Employee';

import brand from '../App/Styles/brand'
import { getTimeRangesForClient, getTimeSelectionsForClient } from '../App/Lib/Utilities'

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

        let items = ["4:00 am", "4:15 am", "4:30 am"]

        //console.log("items", items)

        let times = getTimeSelectionsForClient(240)
        console.log("times", times)
    

        this.setState({
            items: times,
        })

    }



    setSelected = (item) => {
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
                

                <Picker
                    selectedValue={this.state.selectedItem}
                    style={{ height: 10, width: 100, borderStyle: 'dotted', lineHeight: 5 }}
                    itemStyle={{
                        fontSize: 12,

                    }}
                    onValueChange={(itemValue, itemIndex) => this.setSelected(itemValue)}>
                     {this.state.items.map(item => (
                        <Picker.Item label={item} value={item} />
                    ))}
                </Picker>

                <Text>{this.state.selectedItem}</Text>


            </View>

        </ScrollView>
        );
    }

}



export default Test