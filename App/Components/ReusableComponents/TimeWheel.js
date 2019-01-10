import React from 'react';
import { StyleSheet, Text, View, Picker } from 'react-native';


import brand from '../../Styles/brand'
import { getTimeRangesForClient, getTimeSelectionsForClient } from '../../Lib/Utilities'



class TimeWheel extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            items: [],
            selectedItem: this.props.defaultTime || '8:00 AM'
        }

    }

    componentWillMount () {


        let times = getTimeSelectionsForClient(240)
        //console.log("times", times)
    

        this.setState({
            items: times,
        })

    }



    setSelected = (item) => {
        console.log("TimeWheel item changed: ", item)
        this.setState({
            selectedItem: item
        })
        this.props.onSelection(item)
    }


    render() {
        return (



            <View>
                
                {/* // height seems to only really work on Android and needed height: 30 to make it fully visible on Android */}
                <Picker
                    selectedValue={this.state.selectedItem}
                    style={{ height: 30, width: 150 }}
                    itemStyle={{
                        fontSize: 16,
                    }}
                    onValueChange={(itemValue, itemIndex) => this.setSelected(itemValue)}>
                     {this.state.items.map(item => (
                        <Picker.Item 
                            key={item}
                            label={item} value={item} 
                        />
                    ))}
                </Picker>


            </View>

        )
    }

}



export default TimeWheel