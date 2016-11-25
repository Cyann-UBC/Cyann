var Courses = require("../models/course.js");
var Users = require('../models/user.js');
var jwt = require('jsonwebtoken');
var request = require('request');


exports.register = function(req,res){

    if( !req.body.email || !req.body.profileImg || !req.body.socialToken ) {
        var err = new Error();
        err.message = 'Either \'email\' or \'profileImg\' or \'socialToken\' param is missing';
        err.status = 400;
        res.status(400);
        res.json(err);
        return
    }

    // Grab the social network and token
    var socialToken = req.body.socialToken;

    // Validate the social token with Facebook
    validateWithProvider(socialToken).then(function (profile) {
        Users.find({ facebookId: profile.id })
            .then(function(result){
                if( result.length == 0 ){
                    var newUser =   {
                                        name: profile.name,
                                        facebookId: profile.id,
                                        email: req.body.email,
                                        profileImg: req.body.profileImg
                                    };
                    return Users.create(newUser);
                }
                else{
                    return result[0];
                }
            })
            .then(function(user){
                var token = jwt.sign({
                                    facebookId: profile.id,
                                    userId: user._id,
                                    userType: user.userType
                                    }, 'CPEN321_CYANN');
                res.json({ message :'token assigned', jwt: token, userType: user.userType, userId: user._id });
            })
            .catch(function(err){
                var err = new Error();
                err.message = 'Something went wrong...';
                err.status = 500;
                res.status(500);
                res.json(err);
            });
    }).catch(function (err) {
        var err = new Error();
        err.message = 'The Facebook Access Token provided is either invalid or expired';
        err.status = 400;
        res.status(400);
        res.json(err);
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
