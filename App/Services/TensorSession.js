
import { serviceWrapper } from './ServiceWrapper'
import { Parsers } from '../Helpers/Parsers'

export function getTensorSessionInfo(client, token, callback) {

  serviceWrapper('/api/ManagerAppAuth/TensorSessionGet', 'GET', null, client, token, true, function(err, resp) {

    if(err) {
      callback(err)
    }
    else {
      callback(null, resp)
    }

  })


}

