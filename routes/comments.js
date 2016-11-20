"use strict"

var Courses = require("../models/course.js");
var Users = require("../models/user.js");

var POINTS_AWARDED_FOR_EACH_UPVOTE = 1;
var POINTS_AWARDED_FOR_EACH_ANSWER = 2;

/*
    parameter: courseId, postId
    usage: Find all comment within a specific post given the courseId + postId
*/
exports.findAll = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;

    var allComment = req.post.comments;
    res.status( 200 );
    res.json({ message: 'All COMMENT retrieved', data: allComment });
};

/*
    parameter: courseId, postId, commentId
    usage: Find a comment within a specific post given the courseId + postId + commentId
*/
exports.findById = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;

    var thisComment = req.comment;
    res.status( 200 );
    res.json({ message: 'COMMENT retrieved', data: thisComment });
};

/*
    parameter: courseId, postId
    body: userId, content
    usage: Create a comment within a specific post given the courseId + postId
           Updates user's "comment" field with the newly created comment's _id
*/
exports.create = function(req,res){

    // Extract PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var userId = req.user.userId;
    var commentContent = req.body.content;

    if( !commentContent || commentContent == "" ){        
        res.status( 400 );
        res.json({ message: "You cannot create comments with EMPTY content" });
    }

    var newComment = {  'content': commentContent, 
                        'author': userId, 
                        'course': courseId };
    var responseObject = { message: "", data: "" };
    var newCommentObj = null;

    // Find USER given courseId + postId
    Courses.findOne({ '_id': courseId, 'posts._id': postId })
        // Append new COMMENT to our POST + save into DB
        .then(function(result_courseObj){
            var thisComment = result_courseObj.posts.id(postId).comments;
            newCommentObj = thisComment.create(newComment);
            thisComment.push(newCommentObj);
            responseObject.message = 'COMMENT created';
            return result_courseObj.save();
        })
        .then(function(result_courseObj){
            responseObject.data = result_courseObj.posts.id(postId).comments.id(newCommentObj._id);
            res.status( 200 );
            res.json( responseObject ); // return newly created comment
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        });
};

/*
    parameter: courseId, postId, commentId
    body: userId, content
    usage: Edits a comment within a specific post given the courseId + postId + commentId
*/
exports.updateById = function(req,res){

    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;
    // BODY (x-www-form-urlencoded)
    var newCommentContent = req.body.content;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var thisComment = {};

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
            var authorOfComment = thisComment.author;
            if( authorOfComment == userId ){
                var now = new Date();
                thisComment.content = newCommentContent;
                thisComment.updatedAt = now;
                responseObject.message = 'COMMENT updated';
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'You do not have permissions to edit the COMMENT';
            }
        })
        // Send back response
        .then(function(){
            responseObject.data = thisComment;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        });    
}

/*
    parameter: courseId, postId, commentId
    body: userId
    usage: Delete a comment within a specific post given the courseId + postId + commentId
*/
exports.deleteById = function(req,res){

    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var thisComment = {};

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            var authorOfComment = result_courseObj.posts.id(postId).comments.id(commentId).author;
            if( authorOfComment == userId ){
                result_courseObj.posts.id(postId).comments = result_courseObj.posts.id(postId).comments.filter(function(e){ return e.id != commentId; });
                responseObject.message = 'COMMENT deleted';
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'You do not have permissions to delete the COMMENT';
            }
        })
        // Find USER given userId
        .then(function(){
            return Users.findOne({ '_id': userId });
        })
        // Update USER's most recent COMMENT by removing commentId 
        .then(function(result_userObj){
            result_userObj.comments = result_userObj.comments.filter(function(e){ return e != commentId; });
            return result_userObj.save();
        })
        // Send back response
        .then(function(result_userObj){
            responseObject.data = result_userObj;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        });    
}

/*
    parameter: courseId, postId, commentId
    body: userId
    usage: Find a comment within a specific post given the courseId + postId + commentId
                 Sets its 'isAnswer' flag to TRUE
*/
exports.setAsAnswer = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var thisComment = {};
    var updateHonorPoints = false;

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
            if( thisComment.isAnswer != true ){
                thisComment.isAnswer = true;
                responseObject.message = 'COMMENT flagged as an answer';
                updateHonorPoints = true;
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'COMMENT is already an answer';
            }
        })
        .then(function(){
            if( updateHonorPoints ){
                return Users.update(
                           { _id: thisComment.author },
                           { $inc: { honour: +POINTS_AWARDED_FOR_EACH_ANSWER } }
                        )
            }
        })
        // Send back response
        .then(function(){
            responseObject.data = thisComment;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        }); 
}

/*
    parameter: courseId, postId, commentId
    body: userId
    usage: Find a comment within a specific post given the courseId + postId + commentId
                 Sets its 'isAnswer' flag to Flag
*/
exports.unsetAsAnswer = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var thisComment = {};
    var updateHonorPoints = false;

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
            if( thisComment.isAnswer != false ){
                thisComment.isAnswer = false;
                responseObject.message = 'COMMENT unflagged as an answer';
                updateHonorPoints = true;
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'COMMENT is already NOT an answer';
            }
        })
        .then(function(){
            if( updateHonorPoints ){
                return Users.update(
                           { _id: thisComment.author },
                           { $inc: { honour: -POINTS_AWARDED_FOR_EACH_ANSWER } }
                        )
            }
        })
        // Send back response
        .then(function(){
            responseObject.data = thisComment;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        }); 
}

/*
    parameter: courseId, postId, commentId
    body: userId
    usage: Find a comment within a specific post given the courseId + postId + commentId
                 Increment upvote count & append userId into upvote field
*/
exports.upvote = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var updateHonorPoints = false;
    var thisComment = {};

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
            if( thisComment.author == userId ){
                responseObject.message = 'You cannot upvote your own COMMENT';
                responseObject.data = thisComment;
                res.json( responseObject );
            }
            else if( thisComment.upvotedUsers.indexOf(userId) < 0 ){
                thisComment.upvotes += 1;
                thisComment.upvotedUsers.push(userId);
                responseObject.message = 'COMMENT upvoted';
                updateHonorPoints = true;
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'You have already voted for the COMMENT';
                responseObject.data = thisComment;
                res.json( responseObject );
            }
        })
        .then(function(){
            if( updateHonorPoints ){
                return Users.update(
                           { _id: thisComment.author },
                           { $inc: { honour: +POINTS_AWARDED_FOR_EACH_UPVOTE } }
                        )
            }
        })
        // Send back response
        .then(function(){
            responseObject.data = thisComment;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        }); 
}

/*
    parameter: courseId, postId, commentId
    body: userId
    usage: Find a comment within a specific post given the courseId + postId + commentId
           Resets the vote that the user made, if any.
*/
exports.resetVote = function(req,res){
    // PARAMS
    var courseId = req.params.courseId;
    var postId = req.params.postId;
    var commentId = req.params.commentId;
    var userId = req.user.userId;

    // Response Object to send back to caller
    var responseObject = { message: "", data: "" };
    var updateHonorPoints = false;
    var thisComment = {};

    // Find COMMENT given courseId + postId + commentId
    Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId })
        .then(function(result_courseObj){
            thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
            if( thisComment.upvotedUsers.indexOf(userId) > -1 ){
                thisComment.upvotes -= 1;
                thisComment.upvotedUsers = thisComment.upvotedUsers.filter(function(e){ return e != userId; });
                responseObject.message = 'Vote for COMMENT is resetted';
                updateHonorPoints = true
                return result_courseObj.save();
            }
            else{
                responseObject.message = 'You have not voted for the COMMENT';
                responseObject.data = thisComment;
                res.json( responseObject );
            }
        })
        .then(function(){
            if( updateHonorPoints ){
                return Users.update(
                           { _id: thisComment.author },
                           { $inc: { honour: -POINTS_AWARDED_FOR_EACH_UPVOTE } }
                        )
            }
        })
        // Send back response
        .then(function(){
            responseObject.data = thisComment;
            res.status( 200 );
            res.json( responseObject );
        })
        .catch(function(err){
            res.status( 500 );
            res.json({ message: "Something went wrong", err: err });
        });
}