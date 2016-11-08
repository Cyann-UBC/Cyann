var express     =   require("express");                 // See if I can make some change here
var app         =   express();
var morgan      =   require('morgan');                  // log requests to the console (express4)
var bodyParser  =   require("body-parser");             // pull information from HTML POST (express4)
// var multer  = require('multer')                         //use multer for file uploads
var mongoose = require('mongoose');
var path        =   require("path");


app.use(morgan('dev'));                                 // log every request to the console{}
app.use(bodyParser.json());                             // parse application/json
app.use(bodyParser.urlencoded({"extended" : false}));   // DON'T parse application/x-www-form-urlencoded
// app.use(multer({ dest: './uploads/'}))                  //store file in /uploads directory
require('./routes')(app)

app.use(express.static(__dirname + '/public'));

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });r
    next(err);
});

//----------------------------------------
// Routes for loading webpages
//----------------------------------------
var publicPath = path.resolve(__dirname, 'www');
app.use(express.static(publicPath));
app.get('/', function(req, res){ res.sendFile('/index.html', {root: publicPath}); });
app.get('/main', function(req, res){ res.sendFile('/main.html', {root: publicPath}); });

app.listen(3000);
console.log("Listening to PORT 3000");
