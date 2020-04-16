const express = require('express');
const https = require('https');
const http = require('http');
const app = express();
const path = require('path')
const fileUpload = require('express-fileupload');
const tmp = require('tmp');
const fs = require('fs');
const Jimp = require('jimp');
const cfenv = require("cfenv");

var tmpDir = tmp.dirSync();
var imageExtension = 'jpg';


app.set('view engine', 'pug');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: tmpDir.name,
    debug: false
}));
app.use(function (request, response, next) {
    // Instead of "*" you should enable only specific origins
    response.header('Access-Control-Allow-Origin', '*');
    // Supported HTTP verbs
    response.header('Access-Control-Allow-Methods', 'HEAD,GET,PUT,POST,DELETE');
    // Other custom headers
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


// load local VCAP configuration  and service credentials
var vcapLocal;
try {
    vcapLocal = require('./vcap-local.json');
    console.log("Loaded local VCAP", vcapLocal);
} catch (e) { }

const appEnvOpts = vcapLocal ? { vcap: vcapLocal } : {}

const appEnv = cfenv.getAppEnv(appEnvOpts);






// Save images as tmpDir/id
app.post('/image', function (req, res) {
    var newFilePath = path.join(tmpDir.name, req.query.id) + '.' + imageExtension;
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
app.use('/image', express.static(tmpDir.name))


// Serve index but change ig:image to ?id=___
app.get('/', (req, res) => {
    var fileName = req.query.id == undefined ? 'default' : req.query.id;
    res.render('index', { imageFileName: '/image/' + fileName + '.' + imageExtension })
})

var port = process.env.PORT || 3000
http.createServer(app).listen(port);
//https.createServer(options, app).listen(443);
