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



