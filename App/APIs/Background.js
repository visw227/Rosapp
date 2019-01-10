

export function generateRandomNumber(min, max) 
{
    return Math.round(Math.random() * (max-min) + min )
} 

export function checkForNotifications(token, callback) {
    

    fetch('https://jsonplaceholder.typicode.com/users', {  
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      }
    })
    // .then(this.handleErrors)
    .then((results) => {
      return results.json();
    })
    .then(data => {

        callback(null, data)



    })
    .catch(function(error) {
        console.log("error: " , error);
        callback(error)
    });



}




