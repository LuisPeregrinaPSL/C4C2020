const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const path = require('path')
const fileUpload = require('express-fileupload');
const exphbs = require('express-handlebars');
const tmp = require('tmp');
const fs = require('fs');
const Jimp = require('jimp');
const cfenv = require("cfenv");

// Need a temporary directory to save an image.
var tmpDir = tmp.dirSync();
var previewImageExtension = 'jpg';
var previewImageURL = '/image';

// Handlebards
app.set('view engine', '.html');
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', exphbs({
    extname: 'html',
    defaultLayout: 'default'
}));

// Express-FileUpload
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tmpDir.name,
    debug: false
}));

// Ionic CORS
app.use(function (request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,POST');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


var titleShort = 'Staying@home';
var titleLong = titleShort;

// IBM VCAP usage
var vcapLocal;
try {
    vcapLocal = require('./vcap-local.json');
    console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
    console.error(e);
}
const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);






// Save images as tmpDir/id
app.post(previewImageURL, function (req, res) {
    var newFilePath = path.join(tmpDir.name, req.query.id) + '.' + previewImageExtension;
    Jimp.read(req.files.image.tempFilePath, (err, img) => {
        if (err) throw err;
        // We are only interested in turning portait to square or landscape
        if (img.bitmap.height > img.bitmap.width) {
            img.crop(0, 0, img.bitmap.width, img.bitmap.width);
        }
        img.scaleToFit(255, 255)
            .quality(60)
            .write(newFilePath);

        fs.unlinkSync(req.files.image.tempFilePath)
        res.send('File saved as ' + newFilePath);
    }).catch(() => console.error('Couldn\'t read ' + req.files.image.tempFilePath));

})
// Serve images from the temp dir
app.use(previewImageURL, express.static(tmpDir.name))
// Serve css and js
app.use(express.static(path.join(__dirname, 'public')));

var standardRequest = function (req, res, opts) {
    var fileName = req.query.id == undefined ? 'default' : req.query.id;
    opts.imageFileName = previewImageURL + '/' + fileName + '.' + previewImageExtension;
    opts.titleLong = titleLong;
    opts.titleShort = titleShort;
    res.render(req.params.page, opts)
}

// Serve index but change ig:image to ?id=___
app.get('/', (req, res) => {
    req.params = { page: 'main' };
    standardRequest(req, res, {});
})
app.get('/:page', (req, res) => {
    standardRequest(req, res, {});
})

var port = process.env.PORT || 3000
http.createServer(app).listen(port);
//https.createServer(options, app).listen(443);
console.log('Port is ' + port);