"use strict"

var mongoose = require('mongoose');
var Schema =   mongoose.Schema; // create instance of Schema
var db = mongoose.createConnection('mongodb://localhost:27017/posts');


db.on('error',function(err){
  console.error("connection error",err);
});

db.once("open",function(){
  console.log("posts connection successful");
});

// Create schema
var CommentSchema = new Schema({
    "content" : String,
    "author"  : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    "course"  : {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    "createdAt" : { type: Date, default: Date.now },
    "updatedAt" : { type: Date, default: Date.now },
    "upvotes"   : { type: Number, default:0},
    "downvotes"   : { type: Number, default:0},
    // "deleted" : { type: Number, default: 0 } // Field to implement soft deletes
});

var PostSchema  =  new Schema({
    "title" : String,
    "content" : String,
    "author"  : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    "course"  : {type: mongoose.Schema.Types.ObjectId, ref: 'course'},
    "createdAt" : { type: Date, default: Date.now },
    "updatedAt" : { type: Date, default: Date.now },
    "comments" : [CommentSchema]
    // "deleted" : { type: Number, default: 0 }, // Field to implement soft deletes
});

var CourseSchema  =  new Schema({
    "courseName" : {type:String, unique:true, required:true, trim:true},
    //"instructor" : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    "instructor" : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    "TAs":[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    "users":[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    "posts"  : [PostSchema],
    "comments":[CommentSchema]
});


var sortComments = function(a,b){
  //- negative a before b
  //0 no change
  //+ positive a after b
  if(a.upvotes === b.upvotes){
    return b.updated - a.updated
  }
  return b.upvotes - a.upvotes;
}

PostSchema.pre("save",function(next){
  this.comments.sort(sortComments);
  //console.log(this)
  next()
})

// argv[0] == db collection name,
// argv[1] == mongoose schema to use,
// argv[2] == use existing loaded data in db

module.exports = db.model("course", CourseSchema, "course");
