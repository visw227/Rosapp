/*

PLEASE DO NOT change anything with this helper. We rely on it to point to production unless specific env vars are available.
If you need to point to a specific domain for testing, please edit the .env.dev.json file in the root
IMPORTANT NOTE: in the simulator, any "hot reloads" won't refresh the running app's version of the .env files. If you change 
a .env* file, you'll need to restart the app (e.g. react-native run-ios)

App Center Reference for Build Scripts:
https://docs.microsoft.com/en-us/appcenter/build/custom/scripts/

Samples:
https://github.com/microsoft/appcenter/blob/master/sample-build-scripts/react-native/version-name/appcenter-pre-build.sh

*/


export var Config = {

    Environment: function() {

        // load them here so that if they change in __DEV__, the simulator reloads them
        let dev = require("../Environments/dev.json");
        let qa = require("../Environments/qa.json");
        let prod = require("../Environments/prod.json");

        // default to prod, but override below if the environment variables are available
        let ENV = prod


        // the value in this string "should" be set by App Center ONLY, during the pre build process
        // see ./appcenter-pre-build.sh for the script that will set the value below to "build-was-from-appcenter"
        // IMPORANT: PLEASE DO NOT CHANGE THIS VALUE!!!!!!
        let appcenter_pre_build_sh_app_env = "APPCENTER_ROSNET_APP_ENV"

        if(__DEV__) {
            ENV = dev
        }
        else if(appcenter_pre_build_sh_app_env === "is-appcenter") {
            ENV = qa
        }

        console.log("ENV", ENV)

        return ENV

    }


}