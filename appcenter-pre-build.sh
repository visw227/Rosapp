#!/usr/bin/env bash

echo -n 'Dywayne: Replacing ROSNET_APP_ENV in /App/Helpers/Config.js...'

if [ -z "$ROSNET_APP_ENV_VAR" ]
then
    echo "You need define the ROSNET_APP_ENV_VAR variable in App Center, with a value of appcenter"
    exit
fi

CONFIG_FILE=$APPCENTER_SOURCE_DIRECTORY/App/Helpers/Config.js

# sed -i 's/ROSNET_APP_ENV/appcenter/g' /App/Helpers/Config.js


if [ -e "$CONFIG_FILE" ]
then
    echo "Updating the env to $ROSNET_APP_ENV_VAR in /App/Helpers/Config.js"
    sed -i '' -e 's/ROSNET_APP_ENV/"'$ROSNET_APP_ENV_VAR'"/g' $CONFIG_FILE

    echo "Updated contents:"
    cat $CONFIG_FILE

    echo "appcenter-pre-build.sh finished"
fi