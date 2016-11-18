"use strict"
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var db = mongoose.createConnection('mongodb://localhost:27017/userCollection');
    db.on('error',function(err){ console.error("MongoDB Connection Failed",err); });
    db.once("open",function(){ console.log("MongoDB [userCollection] connected successfully"); });

var UserSchema = new mongoose.Schema({
    "facebookId": { type: String, unique: true, required: true },
    "email": { type: String, unique: true},
    "profileImg": { type: String, default: 'http://clipartix.com/wp-content/uploads/2016/05/Smiley-face-free-happy-face-clipart-clipartgo-4.jpg' },
    "name": { type: String, required: true },
    "userType": { type: String, required: true },
    "honour": { type: Number, default: 0 },
    "joined": { type: Date, default: Date.now , select: false},
    "posts": [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course.posts' }],
    "comments": [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course.posts.comments '}]
});

module.exports = db.model('User', UserSchema);