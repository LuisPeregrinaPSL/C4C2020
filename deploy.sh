APP=stay-at-home
WEB=staying-at-home-server
BLUEMIX=stay-at-home-app

# Build app and publish to bluemix
cd $APP
ionic build --prod
ionic cap sync
cp -r www/ ../$BLUEMIX/
cd ../$BLUEMIX/
ibmcloud cf push
# We don't care for the production build. We can't debug it. Use ionic serve --prod
rm -r www

# Build website

cd ../$WEB
ibmcloud cf push