var Student = require('../models/student')
var forumPosts  =   require("../models/mongo");

exports.login = function(req,res,next){
  var checkStudent = function (error,student) {
    if(error || !student){
      res.json({"response":"Wrong ssc or password"})
    }else{
      res.json({response:'success'})
    }
  }
  if(req.body.ssc && req.body.password){
    Student.authenticate(req.body.ssc, req.body.password,checkStudent);
  }else{
    res.json({response:"please provide ssc and password"})
  }
}

exports.signUp = function(req,res){
  if(
    req.body.ssc &&
    req.body.password &&
    req.body.confirmPassword
  ){
    if(req.body.password === req.body.confirmPassword){
      var newStudent = {
        ssc:req.body.ssc,
        password:req.body.password
      }
      var promise = Student.create(newStudent)
      promise.then(function(student){
        res.json({response:student})
      }).catch(function(err){
          res.send(err);
      });
    }else{
      res.json({response:"passwords don't match"})
    }
  }else{
    var err = new Error('field missing')
    err.status = 400;
    res.json({response:"field missing"})
  }
}

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
exports.findBySSC = function(req,res){
  var studnetSSC = req.params.studentSSC
  var promise = Student.findOne({'ssc':studnetSSC})
  promise.then(function(student){
    var studentPromise = forumPosts.find({"author":student.ssc})
    studentPromise.then(function(result){
      res.json({ message: "Retrived post by student", data:result});
    }).catch(function(err){
      res.send(err)
    })
  })
}
