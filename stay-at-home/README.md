# Staying@Home
## About
This app uses Ionic and several modules to acreate a nice user experience.


## Building and delivering
### Generate translations
Requires your `ibm-credentials.env` file in the folder where `translate.js` is.
Generate via `npm run translate`.
### Testing
`ionic serve`
`ionic serve --prod`  # Requires stricter directives, as PROD has these.
`ionic serve --ssl` # In case you need an HTTPS version, e.g. Social Share.
### Building
`ionic build` # Regular
`ionic build --prod`  # Produces a minified JS at www, use this and copy to staying-at-home-server and do "ibmcloud cf push"
