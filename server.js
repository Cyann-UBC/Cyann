var express = require("express");
var morgan = require('morgan');                         // Log requests to the console (express4)
var bodyParser = require("body-parser");                // Pull information from HTML POST (express4)
var path = require("path");
// var multer  = require('multer')                      // Use multer for file uploads
var expressJWT = require('express-jwt');
//var jwt = require('jsonwebtoken');
//var request = require('request');




//----------------------------------------
// DATABASE
//----------------------------------------
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//----------------------------------------
// BEGIN ROUTING
//----------------------------------------
var app = express();
// app.use(morgan('dev'));                                 // Log every request to the console{}
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
    // next(err);
});

//----------------------------------------
// ROUTES FOR WEBPAGE
//----------------------------------------
var publicPath = path.resolve(__dirname, 'www');
app.use(express.static(publicPath));
app.get('/', function(req, res){ res.sendFile('/index.html', {root: publicPath}); });
app.get('/main', function(req, res){ res.sendFile('/main.html', {root: publicPath}); });


//----------------------------------------
// START SERVER
//----------------------------------------
app.listen(8080);
console.log("Listening to PORT 8080");
module.exports.app = app;
