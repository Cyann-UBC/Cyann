var Courses = require("../models/course.js");
var Users = require('../models/user.js');
var jwt = require('jsonwebtoken');
var request = require('request');


// exports.login = function(req,res,next){
//     var checkUser = function (error,user) {
//         if(error || !user){
//             res.json({ "response": "Wrong username or password" });
//         }else{
//             res.json({ "response": "success" });
//         }
//     }
//     if(req.body.username && req.body.password){
//         User.authenticate(req.body.username, req.body.password,checkUser);
//     }else{
//         res.json({ "response": "Please provide username and password" });
//     }
// }

exports.register = function(req,res){

    if( !req.body.userType ) {
        var err = new Error ('userType required!');
        err.status = 400;
        res.json(err);
    }
    // Grab the social network and token
    var socialToken = req.body.socialToken;

    // Validate the social token with Facebook
    validateWithProvider(socialToken).then(function (profile) {
        Users.find({ facebookId: profile.id })
            .then(  function(result) {
                if (result.length == 0) {
                    var newUser =   { 
                                        name: profile.name,
                                        userType: req.body.userType,
                                        facebookId: profile.id,
                                        email: req.body.email,
                                        profileImg: req.body.profileImg
                                    };
                    return Users.create(newUser);
                }
                return result[0];
            })
            .then(function(user){
                var token = jwt.sign({   
                                    facebookId: profile.id,
                                    userId: user._id    
                                    }, 'CPEN321_CYANN');

                res.json(token);
            })
            .catch(function(err){
                res.send(err);
            });
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
                    reject(error);
                }
            }
        );
    });
}
