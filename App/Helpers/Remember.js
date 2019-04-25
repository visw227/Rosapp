
import {  AsyncStorage } from 'react-native';


export var Remember = {


    SetItem: function(key, value) {

        // its up to the consumer of this function to pass a string or JSON value
        AsyncStorage.setItem(key, value)

    },


    GetAllItems: function(callback) {

        let items = []

        AsyncStorage.getAllKeys((err, keys) => {
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    // get at each store's key/value so you can work with it
                    let key = store[i][0];
                    let value = store[i][1];


                    if(key !== 'logData') {
                        items.push({
                            key: key,
                            value: value
                        })
                    }


                });

                callback(items)
            });
        });



    }



}