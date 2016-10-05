"use strict"

var mongoose = require('mongoose');
var Schema =   mongoose.Schema; // create instance of Schema
var forumPosts  =   require("./mongo");

var db = mongoose.createConnection('mongodb://localhost:27017/Courses');

db.on('error',function(err){
  console.error("connection error",err);
});

db.once("open",function(){
  console.log("Courses connection successful");
});


var courseSchema  =  new Schema({
    "courseNum" : String,
    "posts"     :[{type: mongoose.Schema.Types.ObjectId, ref: 'post'}],
});


var Course = db.model('Course', courseSchema);
module.exports = Course;
