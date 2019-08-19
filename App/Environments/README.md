
Environments

We have a separate JSON file for each environment. 

Pay special attention to the follwowing 2 files 
./appcenter-pre-build.sh (only runs in App Center)
./App/Helpers/Config.js


The appcenter-pre-build-sh script only runs in App Center and it foes a find
and replace on a specific string in Config.js that tells the App Center build to point 
to the QA envrionment.


Reference on App Center Reference for Build Scripts:
https://docs.microsoft.com/en-us/appcenter/build/custom/scripts/

Samples:
https://github.com/microsoft/appcenter/blob/master/sample-build-scripts/react-native/version-name/appcenter-pre-build.sh



------------------------------- Example of appcenter-pre-build.sh --------------------------
#!/usr/bin/env bash

# This script is ONLY run in app center.
# We use this to ensure that QA is the target for all API calls

echo "Dywayne: Replacing the APPCENTER_ROSNET_APP_ENV string value in /App/Helpers/Config.js..."

# the full path to the file we are targeting
CONFIG_FILE=$APPCENTER_SOURCE_DIRECTORY/App/Helpers/Config.js

echo "Updating $CONFIG_FILE"
sed -i '' -e 's/APPCENTER_ROSNET_APP_ENV/is-appcenter/g' $CONFIG_FILE

echo "Updated contents:"
cat $CONFIG_FILE
---------------------------------------------------------------------------------------------






