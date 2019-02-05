import { fetchWrapper } from './FetchWrapper'

export function getMobileMenuItems(client, cookies, callback) {

  fetchWrapper('/api/ManagerAppMenu', 'GET', null, client, cookies, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })

}


