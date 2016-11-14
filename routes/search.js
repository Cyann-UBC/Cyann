var Courses = require("../models/course.js");
var Users = require("../models/user.js");

// Search posts
exports.searchPosts = function(req,res){
    res.json({ message: "Search works!" });
}