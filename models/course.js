"use strict"
var mongoose = require("mongoose");

var db = mongoose.createConnection("mongodb://localhost:27017/CyannDatabase");
    db.on("error",function(err){ console.error("MongoDB Connection Failed",err); });
    db.once("open",function(){ console.log("MongoDB [courseCollection] connected successfully"); });

//-----------------------------------
// DATABASE SCHEMA
//-----------------------------------
var CommentSchema = new mongoose.Schema({
    "content": String,
    "course": { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    "author": { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    "createdAt": { type: Date, default: Date.now },
    "updatedAt": { type: Date, default: Date.now },
    "isAnswer": { type: Boolean, default: false },
    "upvotes": { type: Number, default: 0 },
    "upvotedUsers":{ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}] },   // Private fields...
});

var PostSchema = new mongoose.Schema({
    "title": String,
    "content": String,
    "course": { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    "author": { type: mongoose.Schema.ObjectId, ref: "User" },
    "createdAt": { type: Date, default: Date.now },
    "updatedAt": { type: Date, default: Date.now },
    "comments": [CommentSchema]
});

var CourseSchema = new mongoose.Schema({
    "courseName": { type: String, unique: true, required: true, trim: true },
    "instructor": [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    "TAs": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "users": [{ type: mongoose.Schema.Types.ObjectId,  ref: "User" }],
    "posts": [PostSchema]
});

var sortPosts = function(a,b){
  if(a.createdAt < b.createdAt){
    return a.createdAt < b.createdAt
  }
  return b.createdAt - a.createdAt
}

CourseSchema.pre("save",function(next){
  this.posts.sort(sortPosts);
  next()
})

// argv[0] == db collection name,
// argv[1] == mongoose schema to use
module.exports = db.model("Course", CourseSchema, 'Courses');
