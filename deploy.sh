APP=stay-at-home
WEB=staying-at-home-server
BLUEMIX=stay-at-home-app
CFPUSH="ibmcloud cf push"
APK_BUILD="./app/build/outputs/apk/debug/app-debug.apk"
APK_FINAL="public/stay-at-home.apk"

# Build production app
cd $APP
ionic build --prod
# Sync ./android
ionic cap sync
# Copy app www to bluemix instance
cp -r www/ ../$BLUEMIX/
# Android side
cd android
./gradlew --stop
rm $APK_BUILD
./gradlew assembleDebug
# Move it to the web so we can download
mv $APK_BUILD ../../$WEB/$APK_FINAL
cd ../../$BLUEMIX/
$CFPUSH
# We don't care for the production build. We can't debug it. Use ionic serve --prod
rm -r www
# Publish web
cd ../$WEB
$CFPUSH
# Neither care if it stays here, only in cloud foundry.
rm $APK_FINAL