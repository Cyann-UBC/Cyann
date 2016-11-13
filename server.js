var express = require("express");
var morgan = require('morgan');                         // Log requests to the console (express4)
var bodyParser = require("body-parser");                // Pull information from HTML POST (express4)
var path = require("path");
// var multer  = require('multer')                      // Use multer for file uploads
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var secretKey = 'CPEN321_CYANN';




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
// app.use(multer({ dest: './uploads/'}))               // Store file in /uploads directory
require('./routes')(app)

//----------------------------------------
// ERROR HANDLING
//----------------------------------------
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ message: err.message, error: err });r
    next(err);
});

//----------------------------------------
// ROUTES FOR WEBPAGE
//----------------------------------------
var publicPath = path.resolve(__dirname, 'www');
app.use(express.static(publicPath));
app.get('/', function(req, res){ res.sendFile('/index.html', {root: publicPath}); });
app.get('/main', function(req, res){ res.sendFile('/main.html', {root: publicPath}); });


//----------------------------------------
//
//----------------------------------------
app.use(bodyParser.urlencoded());
app.use(expressJWT({ secret: secretKey }).unless({ path: ['/api/users/login', '/api/users/register'] }));

app.post('/api/users/register', function (req, res) {
    // Grab the social network and token
    var network = req.body.network;
    var socialToken = req.body.socialToken;

    // Validate the social token with Facebook
    validateWithProvider(network, socialToken).then(function (profile) {
        // Return a server signed JWT
        res.send(createJwt(profile));
    }).catch(function (err) {
        res.send('Failed!' + err.message);
    });
});

function createJwt(profile) {
    return jwt.sign(profile, secretKey, {
        expiresIn: '2h',
        issuer: 'CYANN'
    });
}

var providers = {
    facebook: {
        url: 'https://graph.facebook.com/me'
    }
};

function validateWithProvider(network, socialToken) {
    return new Promise(function (resolve, reject) {
        // Send a GET request to Facebook with the token as query string
        request({
                url: providers[network].url,
                qs: {access_token: socialToken}
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    resolve(JSON.parse(body));
                } else {
                    reject(err);
                }
            }
        );
    });
}

app.get('/secure', function (req, res) {
    var jwtString = req.get.jwt;

    try {
        var profile = verifyJwt(jwtString);
        res.send('You are good people: ' + profile.id);
    } catch (err) {
        res.send('Hey, you are not supposed to be here');
    }
});

function verifyJwt(jwtString) {
    return jwt.verify(jwtString, secretKey, {
        issuer: 'CYANN'
    });
}


//----------------------------------------
// START SERVER
//----------------------------------------
app.listen(3000);
console.log("Listening to PORT 3000");
