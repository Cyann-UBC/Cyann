"use strict"
var mongoose = require("mongoose");

var db = mongoose.createConnection("mongodb://localhost:27017/courseCollection");
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
    "downvotes": { type: Number, default: 0 },
    "upvotedUsers":{ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}], select: false },   // Private fields...
    "downvotedUsers":{ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}], select: false }, // Private fields...
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
    "instructor": { type: mongoose.Schema.ObjectId, ref: "User" },
    "TAs": [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    "users": [{ type: mongoose.Schema.Types.ObjectId,  ref: "User" }],
    "posts": [PostSchema]
});

var sortComments = function(a,b){
  // "-": "a" will be positioned BEFORE "b"
  // "0": no change
  // "+": "a" will be positioned AFTER "b"
  if(a.upvotes === b.upvotes){
    return b.updated - a.updated
  }
  return b.upvotes - a.upvotes;
}

PostSchema.pre("save",function(next){
    this.comments.sort(sortComments);
    next()
})

// argv[0] == db collection name,
// argv[1] == mongoose schema to use
module.exports = db.model("Course", CourseSchema);
