var express = require("express");
var bodyParser = require("body-parser");                // Pull information from HTML POST (express4)
var path = require("path");
// var multer  = require('multer')                      // Use multer for file uploads
var expressJWT = require('express-jwt');
var helmet = require('helmet')
var cors = require('cors');
var https = require('https');
var fs = require('fs');
var options = {
    ca:fs.readFileSync(__dirname+'/cyann_tech.ca-bundle'),
    key: fs.readFileSync(__dirname+'/cyann_tech.key'),
    cert: fs.readFileSync(__dirname+'/cyann_tech.crt')
};
console.log(__dirname)
//----------------------------------------
// DATABASE
//----------------------------------------
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//----------------------------------------
// BEGIN ROUTING
//----------------------------------------
var app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(helmet());

app.use(bodyParser.json());                             // Parse application/json
app.use(bodyParser.urlencoded({"extended" : false}));   // DON'T parse application/x-www-form-urlencoded
app.use(expressJWT({ secret: 'CPEN321_CYANN' }).unless({ path: ['/api/users/register'] })); //jwt verification middleware.
// app.use(multer({ dest: './uploads/'}))               // Store file in /uploads directory

require('./routes')(app)

//----------------------------------------
// ERROR HANDLING
//----------------------------------------
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });
});

//----------------------------------------
// START SERVER @ PORT 443 (HTTPS)
//----------------------------------------
https.createServer( options, function(req,res)
{
    app.handle( req, res );
}).listen( 443 );
console.log("Listening to PORT 443");

//----------------------------------------
// SET PORT 80 TO REDIRECT TO PORT 443
//----------------------------------------
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);
console.log("All requests sent to PORT 80 will be redirected to PORT 443 instead");

module.exports.app = app;
