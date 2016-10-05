var express     =   require("express");
var app         =   express();
var morgan      =   require('morgan');                  // log requests to the console (express4)
var bodyParser  =   require("body-parser");             // pull information from HTML POST (express4)
// var multer  = require('multer')                         //use multer for file uploads

var mongoose = require('mongoose');


app.use(morgan('dev'));                                 // log every request to the console{}
app.use(bodyParser.json());                             // parse application/json
app.use(bodyParser.urlencoded({"extended" : false}));   // DON'T parse application/x-www-form-urlencoded
// app.use(multer({ dest: './uploads/'}))                  //store file in /uploads directory
require('./routes')(app)

app.use(express.static(__dirname + '/public'));

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });
    next(err);
});

app.get('/', function(req, res) {   res.sendFile(path + '/public/index.html');  }); // Serves our homepage when user enters our BASE-URL
// app.get('*', function(req, res) {   res.redirect('/');  }); // Refirect to homepage for all other requests

app.listen(3000);
console.log("Listening to PORT 3000");
