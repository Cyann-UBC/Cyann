var Courses  = require("../models/mongo");
var Users    = require("../models/user");

/*
  parameter: courseId, postId
  usage: Find all comment within a specific post given the courseId + postId
*/
exports.findAll = function(req,res){

  // PARAMS
  var courseId = req.params.courseId;
  var postId = req.params.postId;
  var commentId = req.params.commentId;

  // Find COMMENT given courseId + postId + commentId
  Courses.findOne({ '_id': courseId, 'posts._id': postId }).exec()
    .then(function(result_courseObj){
      var allComment = result_courseObj.posts.id(postId).comments;
      res.json({ message: 'Retrieved all COMMENT from POST ('+postId+')', data: allComment });
    })
    .catch(function(err){
      res.send(err);
    });
};

/*
  parameter: courseId, postId, commentId
  usage: Find a comment within a specific post given the courseId + postId + commentId
*/
exports.findById = function(req,res){

  // PARAMS
  var courseId = req.params.courseId;
  var postId = req.params.postId;
  var commentId = req.params.commentsId;

  // Find COMMENT given courseId + postId + commentId
  Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId }).exec()
    .then(function(result_courseObj){
      var thisComment = result_courseObj.posts.id(postId).comments.id(commentId);
      res.json({ message: 'Retrieved COMMENT ('+commentId+') from POST ('+postId+')', data: thisComment });
    })
    .catch(function(err){
      res.send(err);
    });
};

/*
  parameter: courseId, postId
  body: userId, content
  usage: Create a comment within a specific post given the courseId + postId
         Updates user's "comment" field with the newly created comment's _id
*/
exports.create = function(req,res){

  // PARAMS
  var courseId = req.params.courseId;
  var postId = req.params.postId;
  // BODY (x-www-form-urlencoded)
  var userId = req.body.userId;
  var newComment = {  'content': req.body.content, 
                      'author': userId, 
                      'course': courseId };

  var newCommentId = null;
  // Find USER given courseId + postId
  Courses.findOne({ '_id': courseId, 'posts._id': postId }).exec()
    // Append new COMMENT to our POST + save into DB
    .then(function(result_courseObj){
      var thisPost = result_courseObj.posts.id(postId).comments;
      var newCommentObj = thisPost.create(newComment);
      thisPost.push(newCommentObj);
      newCommentId = newCommentObj._id; // retrieve _id of newly created comment
      return result_courseObj.save();
    })
    // Find USER given userId
    .then(function(){
      return Users.findOne({ '_id': userId }).exec();
    })
    // Update USER's most recent COMMENT by pushing newest comment id
    .then(function(result_userObj){
      if( newCommentId != null )
        result_userObj.comments.push(newCommentId);
      return result_userObj.save();
    })
    // Send back response
    .then(function(result_userObj){
      res.json({ message: 'Added comment ('+newCommentId+') to post ('+postId+')', data: result_userObj });
    })
    .catch(function(err){
      res.send(err);
    });
};

// exports.updateById = function(req,res){}
exports.deleteById = function(req,res){

  // PARAMS
  var courseId = req.params.courseId;
  var postId = req.params.postId;
  var commentId = req.params.commentId;
  // BODY (x-www-form-urlencoded)
  var userId = req.body.userId;

  // Find COMMENT given courseId + postId + commentId
  Courses.findOne({ '_id': courseId, 'posts._id': postId, 'posts.comments._id': commentId }).exec()
    .then(function(result_courseObj){
      var authorOfComment = result_courseObj.posts.id(postId).comments.id(commentId).author;
      if( authorOfComment == userId ){
        result_courseObj.posts.id(postId).comments = result_courseObj.posts.id(postId).comments.filter(function(e){ return e.id != commentId; });
        return result_courseObj.save();
      }
      
      res.json({ message: 'You do not have permissions to remove COMMENT ('+commentId+') from POST ('+postId+')', data: "" });
    })
    // Find USER given userId
    .then(function(){
      return Users.findOne({ '_id': userId }).exec();
    })
    // Update USER's most recent COMMENT by removing commentId 
    .then(function(result_userObj){
      result_userObj.comments = result_userObj.comments.filter(function(e){ return e != commentId; });
      return result_userObj.save();
    })
    // Send back response
    .then(function(result_userObj){
        res.json({ message: 'Removed COMMENT ('+commentId+') from POST ('+postId+')', data: result_userObj });
    })
    .catch(function(err){
      res.send(err);
    });  
}
// exports.setAsAnswer = function(req,res){}
// exports.unsetAsAnswer = function(req,res){}
// exports.upvote = function(req,res){}
// exports.downvote = function(req,res){}