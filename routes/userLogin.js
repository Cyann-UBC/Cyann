var User = require('../models/user')
    var forumPosts  =   require("../models/mongo");

exports.login = function(req,res,next){
    var checkUser = function (error,user) {
	if(error || !user){
	    res.json({"response":"Wrong ssc or password"})
	}else{
	    res.json({response:'success'})
	}
    }
    if(req.body.ssc && req.body.password){
	User.authenticate(req.body.ssc, req.body.password,checkUser);
    }else{
	res.json({response:"please provide ssc and password"})
    }
}

    exports.signUp = function(req,res){
	if(
    req.body.ssc &&
    req.body.name &&
    req.body.password &&
    req.body.confirmPassword&&
    req.body.userType
	   ){
	    if(req.body.password === req.body.confirmPassword){
		var newUser = {
		    ssc:req.body.ssc,
		    name:req.body.name,
		    password:req.body.password,
		    userType:req.body.userType,
		    honor:0
		}
		var promise = User.create(newUser)
		promise.then(function(user){
			res.json({response:user})
		    }).catch(function(err){
			    res.send(err);
			});
	    }else{
		res.json({response:"passwords don't match"})
	    }
	}else{
	    var err = new Error('field missing')
	    err.status = 400;
	    res.json({response:"field missing"})
	}
    }