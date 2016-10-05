var Student = require('../models/student')
var Course  =   require("../models/mongo");

//find all student
exports.findAll = function(req,res){
  var promise = Student.find( {} );
  promise.then(function (result){
      res.json({ message: 'Retrieved all student!', data: result });
  }).catch(function(err){
      res.send(err);
  });
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
    // var studentPromise = Course.find({"author":student.ssc})
    // studentPromise.then(function(result){
    //   res.json({ message: "Retrived post by student", data:result});
    // }).catch(function(err){
    //   res.send(err)
    // })

}
