const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const path = require('path')

// Ionic CORS
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.static(path.join(__dirname, 'www')));
//Redirect for when refreshed.
app.get('*', function (req, res) {
    res.redirect('/');
});
var port = process.env.PORT || 3000
http.createServer(app).listen(port);
//https.createServer(options, app).listen(443);
console.log('Port is ' + port);