var Student = require('../models/student')
var Course  =   require("../models/mongo");

//find all student
exports.findAll = function(req,res){
  var promise = Student.find( {} , 'ssc name posts comments');
  promise.then(function (result){
      res.json({ message: 'Retrieved all student!', data: result });
  }).catch(function(err){
      res.send(err);
  });
}

//Convert a studentId to a name
exports.findById = function(req,res){
  res.json({data:req.student})
}


//find post by written by a specific student
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
