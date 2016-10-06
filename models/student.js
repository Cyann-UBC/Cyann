"use strict"

var mongoose = require('mongoose');
var Schema =   mongoose.Schema; // create instance of Schema
var forumPosts  =   require("./mongo");
var bcrypt = require('bcrypt');

var db = mongoose.createConnection('mongodb://localhost:27017/CyannStudent');

db.on('error',function(err){
  console.error("connection error",err);
});

db.once("open",function(){
  console.log("CyanStudent connection successful");
});


var StudentSchema = new Schema({
    "ssc" : {type:String, unique:true, required:true, trim:true},
    "name": {type:String, required:true},
    "password"  : {type:String, required:true},
    "joined" : { type: Date, default: Date.now },
    "posts"   : [{type: mongoose.Schema.Types.ObjectId, ref: 'course.posts'}],
    "comments":[{type: mongoose.Schema.Types.ObjectId, ref: 'course.comments'}],
     //"posts":[],
    // "comments":[]
});

StudentSchema.statics.authenticate = function(ssc, password, callback){
  Student.findOne({ssc:ssc})
    .exec(function(error, student){
      if(error){
        return callback(error);
      }else if(!student){
        var err = new Error('Student not found');
        err.status = 401
        return callback(err)
      }
      bcrypt.compare(password, student.password, function(error, result){
        if(result === true){
           console.log("asd")
          return callback(null, student)
        }else{
          return callback()
        }
      })
    })
}

StudentSchema.pre('save', function(next) {
  var student = this;
  bcrypt.hash(student.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    student.password = hash;
    next();
  })
});


var Student = db.model('Student', StudentSchema);
module.exports = Student;
