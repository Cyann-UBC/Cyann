var Courses = require("../models/course.js");
var Users = require('../models/user.js')
var mongoose = require('mongoose');

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
    res.json({ data: req.user });
}

//find post by written by a specific user
exports.findPostById = function(req,res){

    var userId = req.params.userId;
    Courses.aggregate([ { $match: {'posts.author': mongoose.Types.ObjectId(userId)} },
                        { $unwind: '$posts' },
                        { $project: {   _id: 0,
                                        'course': { 
                                            '_id': '$_id', 
                                            'name': '$courseName' 
                                        },
                                        '_id': '$posts._id', 
                                        'title': '$posts.title', 
                                        'content': '$posts.content', 
                                        'updatedAt': '$posts.updatedAt', 
                                        'createdAt': '$posts.createdAt' 
                                    } },
                        { $sort: { 'createdAt': -1 } } ], function(err, result) {
                                if (err) {
                                    res.status(400);
                                    res.json(err);
                                }
                                else{
                                    res.status(200);
                                    res.json(result);
                                }
                            }
    );
}

exports.findCommentById = function(req,res){
    
    var userId = req.params.userId;
    Courses.aggregate([ { $match: {'posts.comments.author': mongoose.Types.ObjectId(userId)} },
                        { $unwind: '$posts' },
                        { $unwind: '$posts.comments' },
                        { $match: {'posts.comments.author': mongoose.Types.ObjectId(userId)} }, // match again...
                        { $project: {   _id: 0,
                                        '_id': '$posts.comments._id', 
                                        'course': { 
                                            '_id': '$_id', 
                                            'name': '$courseName' 
                                         }, 
                                        'post': { 
                                            '_id': '$posts._id'
                                         },
                                        'content': '$posts.comments.content',
                                        'upvotes': '$posts.comments.upvotes',
                                        'updatedAt': '$posts.comments.updatedAt', 
                                        'createdAt': '$posts.comments.createdAt' 
                                    } },
                        { $sort: { 'createdAt': -1 } } ], function(err, result) {
                                if (err) {
                                    res.status(400);
                                    res.json(err);
                                }
                                else{
                                    res.status(200);
                                    res.json(result);
                                }
                            }
    );
}