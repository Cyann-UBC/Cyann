var User = require('../models/user')
var Course  =   require("../models/mongo");

//find all user
exports.findAll = function(req,res){
  var promise = User.find( {} , 'ssc name posts comments');
  promise.then(function (result){
      res.json({ message: 'Retrieved all user!', data: result });
  }).catch(function(err){
      res.send(err);
  });
}

//Convert a userId to a name
exports.findById = function(req,res){
  res.json({data:req.user})
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
    })
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
  })
}
