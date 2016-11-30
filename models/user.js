"use strict"
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/CyannDatabase');
    db.on('error',function(err){ console.error("MongoDB Connection Failed",err); });
    db.once("open",function(){ console.log("MongoDB [userCollection] connected successfully"); });

var UserSchema = new mongoose.Schema({
    "facebookId": { type: String, unique: true, required: true },
    "email": { type: String, unique: true, required: true},
    "profileImg": { type: String, unique: true, required: true },
    "name": { type: String, required: true },
    "userType": { type: String, required: true, default: 'student' },
    "honor": { type: Number, default: 0 },
    "joined": { type: Date, default: Date.now , select: false}
});
module.exports = db.model('User', UserSchema, 'Users');
