/*

PLEASE DO NOT change anything with this helper. We rely on it to point to production unless specific env vars are available.
If you need to point to a specific domain for testing, please edit the .env.dev.json file in the root
IMPORTANT NOTE: in the simulator, any "hot reloads" won't refresh the running app's version of the .env files. If you change 
a .env* file, you'll need to restart the app (e.g. react-native run-ios)

Reference:
https://docs.microsoft.com/en-us/appcenter/build/custom/variables/

In App Center:
https://appcenter.ms/orgs/Rosnet/apps/iOS-Rosnet/build/branches/master/configure

Samples:
https://github.com/microsoft/appcenter/blob/master/sample-build-scripts/react-native/version-name/appcenter-pre-build.sh

*/

import dev  from '../.env.dev.json'
import qa   from '../.env.qa.json'
import prod from '../.env.prod.json'


export var Config = {

    Environment: function() {
      
        // default to prod, but override below if the environment variables are available
        let ENV = prod


        // the value in this string "should" be set by App Center ONLY, during the post build process
        // see ./appcenter-post-build.sh for the script that will set the value below to "appcenter"
        let appcenter_pre_build_sh_app_env = "ROSNET_APP_ENV"

        if(__DEV__) {
            ENV = dev
        }
        else if(appcenter_pre_build_sh_app_env === "appcenter") {
            ENV = qa
        }

        console.log("ENV", ENV)

        return ENV

    }


}