var Courses = require("../models/course.js");
var Users = require('../models/user.js')

//find all user
exports.findAll = function(req,res){
    Users.find()
        .select('-__v')
        .then(function (result){
            res.json({ message: 'Retrieved all user!', data: result });
        }).catch(function(err){
            res.send(err);
        });
}

//Convert a userId to a name
exports.findById = function(req,res){
    Users.findById({"_id": req.params.userId})
                .then (function (user){
                    res.json({ userInfo: user });
                }).catch(function(err){
                    res.send(err);
                });
}

//find post by written by a specific user
exports.findPostById = function(req,res){
    var promise = Course.aggregate({
        $match: {'posts.author': {$gte: 'Howard Zhou'}}
    }, {
        $unwind: '$posts'
    }, {
        $match: {'posts.author': {$gte: 'Howard Zhou'}}
    }, {
        $project: {
            title: '$posts.title',
            content:'$posts.content'
        }
    })
    promise.then(function(result){
        console.log(result)
    }).catch(function(err){
        res.send(err)
    });
}

exports.findCommentById = function(req,res){
    var promise = Course.aggregate({
            $match: {'posts.comments.author': {$gte: 'Howard Zhou'}}
        }, {
            $unwind: '$posts.comments'
         }, {
            $match: {'posts.comments.author': {$gte: 'Howard Zhou'}}
        }, {
        $project: {
            title: '$comments.title',
            content:'$comments.content'
        }
    })
    promise.then(function(result){
        console.log(result)
    }).catch(function(err){
        res.send(err)
    });
}

// Users.findById({"_id": req.user.userId})
//                 .then (function (user){
//                     res.json({ userInfo: user});
//                 }).catch(function(err){
//                     res.send(err);
//                 });

