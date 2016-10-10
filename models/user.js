"use strict"

var mongoose = require('mongoose');
var Schema =   mongoose.Schema; // create instance of Schema
var forumPosts  =   require("./mongo");
var bcrypt = require('bcrypt');

var db = mongoose.createConnection('mongodb://localhost:27017/CyannUser');

db.on('error',function(err){
  console.error("connection error",err);
});

db.once("open",function(){
  console.log("CyanUser connection successful");
});


var UserSchema = new Schema({
    "ssc" : {type:String, unique:true, required:true, trim:true},
    "name": {type:String, required:true},
    "password"  : {type:String, required:true},
    "userType"  : {type:String, required:true},
    "honour"    : Number,
    "joined" : { type: Date, default: Date.now },
    "posts"   : [{type: mongoose.Schema.Types.ObjectId, ref: 'course.posts'}],
    "comments":[{type: mongoose.Schema.Types.ObjectId, ref: 'course.comments'}],
});

UserSchema.statics.authenticate = function(ssc, password, callback){
  User.findOne({ssc:ssc})
    .exec(function(error, user){
      if(error){
        return callback(error);
      }else if(!user){
        var err = new Error('User not found');
        err.status = 401
        return callback(err)
      }
      bcrypt.compare(password, user.password, function(error, result){
        if(result === true){
           console.log("asd")
          return callback(null, user)
        }else{
          return callback()
        }
      })
    })
}

UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = db.model('User', UserSchema);
module.exports = User;
