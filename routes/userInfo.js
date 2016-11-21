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
    Users.findById({"_id": req.user.userId})
                .then (function (user){
                    res.json({ userInfo: user });
                }).catch(function(err){
                    res.send(err);
                });
}

//find post by written by a specific user
exports.findPostById = function(req,res){

    var userId = req.user.userId;
    Courses.aggregate()
        .match({ 'posts.author': mongoose.Types.ObjectId(userId) }) // Filter out courses w/o users's authored post
        .unwind('$posts')
        .match({ 'posts.author': mongoose.Types.ObjectId(userId) }) // Filter out posts that aren't authored by user
        .project({
            _id: 0,
            'course': {
                '_id': '$_id',
                'name': '$courseName'
            },
            '_id': '$posts._id',
            'title': '$posts.title',
            'content': '$posts.content',
            'updatedAt': '$posts.updatedAt',
            'createdAt': '$posts.createdAt'
        })
        .sort({ 'createdAt': -1 })
        .exec(function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            }
            else{
                res.status(200);
                res.json(result);
            }
        });
}

exports.findCommentById = function(req,res){
    var userId = req.user.userId;
    Courses.aggregate()
        .match({ 'posts.comments.author': mongoose.Types.ObjectId(userId) })  // Filter out courses w/o users's post
        .unwind('$posts')
        .unwind('$posts.comments')
        .match({ 'posts.comments.author': mongoose.Types.ObjectId(userId) }) // Filter out posts that aren't authored by user
        .project({
            _id: 0,
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
        })
        .sort({ 'createdAt': -1 })
        .exec(function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            }
            else{
                res.status(200);
                res.json(result);
            }
        });
}

//find post by written by a specific user
exports.getCourseData = function(req,res){

    var userId = req.user.userId;

    // First use "REDACT" operator to filter in courses that user is in
    Courses.aggregate([{
            "$redact": {
                "$cond": [
                    {
                        "$setIsSubset": [
                            [mongoose.Types.ObjectId(userId)],
                            "$users"
                        ]
                    },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            }
        }])
        // "PROJECT" operator to change db query response format
        .project({
            'courseName': '$courseName',
            'instructor': '$instructor',
            'TAs': '$TAs',
            'postCount': { $size: '$posts' },
            'userCount': { $size: '$users' }
        })
        .exec(function(err, result){
            if (err) {
                res.status(400);
                res.json(err);
            }
            else{
                return result;
            }
        })
        // Due to how mongoose is designed, we have to make a 2nd query in order to POPULATE after an AGGREGATE
        .then(function(result2){
            Users.populate(result2, {path: "TAs instructor", select: "name", model: Users}, function(err, result3){
                if (err) {
                    res.status(400);
                    res.json(err);
                }
                else{
                    res.status(200);
                    res.json(result3);
                }
            });
        })
        .catch(function(err){
            res.status(400);
            res.json(err);
        });
}
