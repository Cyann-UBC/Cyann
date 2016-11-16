var express = require("express");
var morgan = require('morgan');                         // Log requests to the console (express4)
var bodyParser = require("body-parser");                // Pull information from HTML POST (express4)
var path = require("path");
var expressJWT = require('express-jwt');
// var multer  = require('multer')                      // Use multer for file uploads

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
app.use(morgan('dev'));                                 // Log every request to the console{}
app.use(bodyParser.json());                             // Parse application/json
app.use(bodyParser.urlencoded({"extended" : false}));   // DON'T parse application/x-www-form-urlencoded

//----------------------------------------
// USER AUTHENTICATION
//----------------------------------------
app.use(expressJWT({ secret: 'CPEN321_CYANN' }).unless({ path: ['/api/users/register'] }));
app.use(function(req, res, next) {
    var expireDuration = 60*60*24*2; // 2 days
    var epochTimeNow = Math.floor((new Date).getTime()/1000);
    if( epochTimeNow > req.user.iat + expireDuration ){
        var tokenExpiredAt = new Date(0);           // The 0 there is the key, which sets the date to the epoch
        tokenExpiredAt.setUTCSeconds(req.user.iat + expireDuration); // req.user.iat contains UNIX timestamp of when JWT is issued
        
        res.status(400);
        return res.json({ "error": { "message": "Error validating access token: Session has expired on " + tokenExpiredAt + ". The current time is " + new Date() }});
    }
    return next();
});

//----------------------------------------
// FILE UPLOAD
//----------------------------------------
// app.use(multer({ dest: './uploads/'}))               // Store file in /uploads directory

require('./routes')(app)

//----------------------------------------
// ERROR HANDLING
//----------------------------------------
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });
    next(err);
});

//----------------------------------------
// START SERVER
//----------------------------------------
app.listen(3000);
console.log("Listening to PORT 3000");
