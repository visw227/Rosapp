
import { AsyncStorage } from "react-native"

export function getFavorites(callback) {


    AsyncStorage.getItem('favorites').then((data) => {

        let list = []

        if(data) {
            list = JSON.parse(data)
        }


        callback(list)

    })


}


export function saveFavorite(mode, id, callback) {


    AsyncStorage.getItem('favorites').then((data) => {

        let list = []

        // update the list
        if(data) {


            list = JSON.parse(data)

            // let exists = list.find(function(item){
            //     return item.itemId === fav.itemId
            // })

            let exists = list.includes(id)

            if(mode === true) {
                if(!exists) {

                    console.log("adding new favorite", id)
                    list.push(id)

                    AsyncStorage.setItem('favorites', JSON.stringify(list))
                }
                else {
                    console.log("favorite already exists", id)
                }

                callback(list)
            }
            else {

                console.log("favorite removed", id)

                const newList = list.filter(function(item) {
                    return item !== id
                })
                AsyncStorage.setItem('favorites', JSON.stringify(newList))

                callback(newList)
            }

        }
        // create the list 
        else {

            list.push(id)
            AsyncStorage.setItem('favorites', JSON.stringify(list))
            callback(list)
        }



    })


}


export function emptyFavorites(callback) {


    AsyncStorage.removeItem('favorites')

    callback(null)


}