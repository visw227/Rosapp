import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, Text, View } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        backgroundColor: 'white',
        color: 'black',
    },
});

export default class DropDown extends Component {
    constructor(props) {
        super(props)
        this.inputRefs = {}
        this.selectValue = this.selectValue.bind(this)
        this.state = {
            selected: this.props.defaultSelected,
            items: [],
        }
    }
  
    selectValue(value){
        console.log('select value', value)
        this.setState({
            selected: value,
        });
        
        this.props.onChange(value);
        
    }
    

    render() {
        const { label, value, options,extraLabel,internalArray } = this.props;
        let items = [];
        console.log('options', this.props);
        if(options.length > 0 ){
            items = options.map(i => {
             
                return {
                    label: i[label],
                    value: i[value]
                }
                
            //}
            })
            console.log('items',items)
        }
       
                    
       

        return (
            <View>
                {items.length > 0 ?
                <RNPickerSelect
                    placeholder={{
                        label: this.props.placeholder,
                        value: null,
                    }}
                    items={items}
                    onValueChange={this.selectValue}
                    style={{ ...pickerSelectStyles }}
                    value={this.state.selected}
                    ref={(el) => {
                        this.inputRefs.picker = el;
                    }}
                    
                /> : null }
            </View>
        )
    }
}
