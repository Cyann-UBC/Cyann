const hostname = 'cyann.tech';
const port  = '80';
var express = require("express");
var morgan = require('morgan');                         // Log requests to the console (express4)
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
// app.use(morgan('dev'));                              // Log every request to the console{}

app.use(helmet());
// app.use(morgan('dev'));                              // Log every request to the console{} (for dev only)

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
// var publicPath = path.resolve(__dirname, 'www');
// app.use(express.static(publicPath));
// app.get('/', function(req, res){ res.sendFile('/index.html', {root: publicPath}); });
// app.get('/main', function(req, res){ res.sendFile('/main.html', {root: publicPath}); });


//----------------------------------------
// START SERVER
//----------------------------------------
 https.createServer(options, function(req,res){
     app.handle(req, res);
 }).listen(443);
 console.log("Listening to PORT 443");
module.exports.app = app;
