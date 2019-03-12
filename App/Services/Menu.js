import { serviceWrapper } from './ServiceWrapper'

export function getMobileMenuItems(client, token, callback) {

  serviceWrapper('/api/ManagerAppMenu', 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}


