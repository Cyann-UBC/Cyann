var Courses = require("../models/course.js");
var Users = require('../models/user.js')

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

exports.signUp = function(req,res){
    if( req.body.username &&
        req.body.name &&
        req.body.password &&
        req.body.confirmPassword&&
        req.body.userType ){
        
        if(req.body.password === req.body.confirmPassword){
            var newUser = { username: req.body.username,
                            name: req.body.name,
                            password: req.body.password,
                            userType: req.body.userType };
            
            Users.create(newUser)
                .then(function(user){
                    res.json({ "response": user });
                }).catch(function(err){
                    res.send(err);
                });
        }else{
            res.json({ "response": "Passwords don't match" });
        }
    }else{
        var err = new Error('Field missing')
        err.status = 400;
        res.json(err)
    }
}
