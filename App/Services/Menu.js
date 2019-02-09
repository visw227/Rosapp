import { fetchWrapper } from './FetchWrapper'

export function getMobileMenuItems(client, token, callback) {

  fetchWrapper('/api/ManagerAppMenu', 'GET', null, client, token, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}


