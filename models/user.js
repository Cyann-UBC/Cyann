"use strict"
var mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://localhost:27017/userCollection');
    db.on('error',function(err){ console.error("MongoDB Connection Failed",err); });
    db.once("open",function(){ console.log("MongoDB [userCollection] connected successfully"); });

var UserSchema = new mongoose.Schema({
    //"username": { type: String, unique: true, required: true, trim: true },
    "jwt": {type: String},
    "name": { type: String, required: true },
    //"password": { type: String, required: true, select: false },
    "userType": { type: String, required: true },
    "honour": { type: Number, default: 0 },
    "joined": { type: Date, default: Date.now , select: false},
    "posts": [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course.posts' }],
    "comments": [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course.posts.comments '}]
});

// UserSchema.statics.authenticate = function(username, password, callback){
//     User.findOne({username:username})
//         .exec(function(error, user){
//             if(error){
//                 return callback(error);
//             }else if(!user){
//                 var err = new Error('User not found');
//                 err.status = 401
//                 return callback(err)
//             }
//             bcrypt.compare(password, user.password, function(error, result){
//                 if(result === true){
//                     console.log("asd")
//                     return callback(null, user)
//                 }else{
//                     return callback()
//                 }
//             })
//         })
// }

// UserSchema.pre('save', function(next) {
//     var user = this;
//     bcrypt.hash(user.password, 10, function(err, hash) {
//         if (err) {
//             return next(err);
//         }
//         user.password = hash;
//         next();
//     })
// });

// argv[0] == db collection name,
// argv[1] == mongoose schema to use
module.exports = db.model('User', UserSchema);
