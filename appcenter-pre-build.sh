#!/usr/bin/env bash

echo ">>> Replacing ROSNET_APP_ENV in Config.js..."

sed -i 's/ROSNET_APP_ENV/appcenter/g' /App/Helpers/Config.js

echo ">>> REPLACED"

