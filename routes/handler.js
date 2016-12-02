var Courses = require("../models/course.js");
var Users = require('../models/user.js');

exports.handleCourseId = function(req,res,next,id){
    Courses.findById({ '_id': req.params.courseId })
        .populate("instructor", "name email profileImg userType", Users)
        .populate("posts.author", "name email profileImg userType", Users)
        .populate("posts.comments.author", "name email profileImg userType", Users)
        .then(function (result){
            if(!result){
                err = new Error("RESOURCE_NOT_FOUND");
                err.status = 404;
                return next(err);
            }
            req.course = result;
            return next();
        }).catch(function(err){
            next(err);
        });
};

exports.handlePostId = function(req,res,next,id){
    req.post = req.course.posts.id(id)
    if(!req.post){
        err = new Error("RESOURCE_NOT_FOUND");
        err.status = 404;
        return next(err);
    }
    return next();
};

/*
  Middleware that executes whenever the API endpoint contains a ":commendId" param
  Precondition: API call contains ":postId" & route passes through this.handlePostId()
*/
exports.handleCommentId = function(req,res,next,id){
    req.comment = req.post.comments.id(id);
    if(!req.comment){
        err = new Error("RESOURCE_NOT_FOUND");
        err.status = 404;
        return next(err);
    }
    return next();
}

exports.handleUserId = function(req,res,next,id){
    var userId = req.params.userId
    Users.findById(userId)
        .select('-__v')
        .then(function(user){
            req.user = user
            return next();
        }).catch(function(err){
            res.status(400);
            res.send(err);
        });
}
