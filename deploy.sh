APP=stay-at-home
WEB=staying-at-home-server
BLUEMIX=stay-at-home-app

# Build app and publish to bluemix
cd $APP
ionic build --prod
ionic cap sync
cp -r www/ ../$BLUEMIX/
# Build app
cd android
./gradlew --stop
rm ./app/build/outputs/apk/debug/app-debug.apk
./gradlew assembleDebug
mv ./app/build/outputs/apk/debug/app-debug.apk ../../$WEB/public/stay-at-home.apk

cd ../../$BLUEMIX/
ibmcloud cf push
# We don't care for the production build. We can't debug it. Use ionic serve --prod
rm -r www

#
cd ..

# Build website

cd ../$WEB
ibmcloud cf push

