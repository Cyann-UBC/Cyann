var Courses = require("../models/course.js");
var Users = require('../models/user.js');
var jwt = require('jsonwebtoken');
var request = require('request');

//app.use(bodyParser.urlencoded({"extended" : false}));   // DON'T parse application/x-www-form-urlencoded
//app.use(expressJWT({ secret: 'CPEN321_CYANN' }).unless({ path: ['api/user/register'] }));

exports.login = function(req,res,next){
    var checkUser = function (error,user) {
        if(error || !user){
            res.json({ "response": "Wrong username or password" });
        }else{
            res.json({ "response": "success" });
        }
    }
    if(req.body.username && req.body.password){
        User.authenticate(req.body.username, req.body.password,checkUser);
    }else{
        res.json({ "response": "Please provide username and password" });
    }
}

exports.register = function(req,res){
    // Grab the social network and token
    var socialToken = req.body.socialToken;

    // Validate the social token with Facebook
    validateWithProvider(socialToken).then(function (profile) {
        if( req.body.name &&
            req.body.userType )
        {
            var myToken = createJwt(profile);
            //res.json(myToken);
            var newUser =   { 
                                name: req.body.name,
                                jwt: myToken,
                                userType: req.body.userType 
                            };
            //res.json({newUser});
            Users.create(newUser)
                .then(function(user){
                    res.json('haha');
                }).catch(function(err){
                    res.send(err);
                });
        }
        else    {
                    res.json({ "response": "Missing required fields." });
                    var err = new Error('Field missing')
                    err.status = 400;
                    res.json(err)
                }
    }).catch(function (err) {
        res.send('Failed!' + err.message);
    });
}

function validateWithProvider(socialToken) {
    return new Promise(function (resolve, reject) {
        // Send a GET request to Facebook with the token as query string
        request({
                url: 'https://graph.facebook.com/me',
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

function createJwt(profile) {
    return jwt.sign(profile, 'CPEN321_CYANN', {
        expiresIn: '2h',
        issuer: 'CYANN'
    });
}
