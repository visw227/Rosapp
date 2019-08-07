#!/usr/bin/env bash

echo "Dywayne: Replacing the ROSNET_APP_ENV string value in /App/Helpers/Config.js..."

# the full path to the file we are targeting
CONFIG_FILE=$APPCENTER_SOURCE_DIRECTORY/App/Helpers/Config.js

echo "Updating the env to 'appcenter' in $CONFIG_FILE"
sed -i '' -e 's/ROSNET_APP_ENV/appcenter/g' $CONFIG_FILE

echo "Updated contents:"
cat $CONFIG_FILE



