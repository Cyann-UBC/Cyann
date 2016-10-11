var Courses  = require("../models/mongo");
var Users    = require("../models/user");

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
  var newComment = { 'content': req.body.content };

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