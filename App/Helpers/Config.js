/*

PLEASE DO NOT change anything with this helper. We rely on it to point to production unless specific env vars are available.
If you need to point to a specific domain for testing, please edit the .env.dev.json file in the root
IMPORTANT NOTE: in the simulator, any "hot reloads" won't refresh the running app's version of the .env files. If you change 
a .env* file, you'll need to restart the app (e.g. react-native run-ios)

*/

import dev  from '../.env.dev.json'
import qa   from '../.env.qa.json'
import prod from '../.env.prod.json'


export var Config = {

    Environment: function() {
      
        // default to prod, but override below if the environment variables are available
        let ENV = prod

        if(__DEV__) {
            ENV = dev
        }
        else if(RUNNING_IN_APP_CENTER) {
            ENV = qa
        }

        console.log("ENV", ENV)

        return ENV

    }


}