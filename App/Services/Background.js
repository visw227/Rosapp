import { fetchWrapper } from './FetchWrapper'


export function generateRandomNumber(min, max) 
{
    return Math.round(Math.random() * (max-min) + min )
} 

export function checkForNotifications(client, token, callback) {
    

    fetchWrapper('/api/ManagerAppAlerts', 'GET', null, client, token, function(err, resp) {

        if(err) {
            callback(err)
        }
        else {
            callback(null, resp)
        }

    })




}




