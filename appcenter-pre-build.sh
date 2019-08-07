echo -n 'Dywayne: Replacing ROSNET_APP_ENV in /App/Helpers/Config.js...'

echo -n 'CUSTOM_ROSNET_APP_ENV: $CUSTOM_ROSNET_APP_ENV'

sed -i 's/ROSNET_APP_ENV/appcenter/g' /App/Helpers/Config.js

echo 'appcenter-pre-build.sh DONE!'

