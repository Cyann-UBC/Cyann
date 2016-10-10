var Course  =   require("../models/mongo");
var User = require('../models/user')

exports.handleCourseId = function(req,res,next,id){
    Course.findById(req.params.courseId,function(err,doc){
      if(err) return next(err);
      if(!doc){
        err = new Error("Not Found");
        err.status = 404;
        return next(err);
      }
    //  console.log('as')
      req.course = doc;
      return next();
    })
};

exports.handlePostId = function(req,res,next,id){
  req.post = req.course.posts.id(id)
  if(!req.post){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  console.log(req.post)
  return next();
};

exports.handleCommenId = function(req,res,next,id){
  req.comment = req.course.posts.comments.id(id)
  if(!req.comment){
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  //console.log(req.comment)
  return next();
}

exports.handleId = function(req,res,next,id){
  var studnetId = req.params.userId
  var promise = User.findById(studnetId)
  promise.then(function(user){
    req.user = user
    return next();
  }).catch(function(err){
    res.send(err)
  })
}
