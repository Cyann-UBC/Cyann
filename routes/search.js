var Courses = require("../models/course.js");
var Users = require("../models/user.js");

// Search posts by:
// - Keyword
// - Author (userId)
// - Timestamp ()
exports.searchPosts = function(req,res){

    var keyword = req.query.keyword;
    var userId = req.query.userId;
    var timestamp = req.query.timestamp; // UTC timestamp

    Courses.findById({ '_id': req.params.courseId })
        .select("-__v")
        .populate("instructor", "name", Users)
        .populate("posts.author", "name", Users)
        .populate("posts.comments.author", "name", Users)
        .then(function (result){
            var filteredResults = result.posts;

            // FILTER out posts whose TITLE or CONTENT doesn't contain the keyword
            if( keyword ){
                filteredResults = filteredResults.filter(function(thisPost){
                    return thisPost.title.includes(keyword) || thisPost.content.includes(keyword);
                });
            }

            // FILTER out posts that isn't author'ed by the given userId
            if( userId ){
                filteredResults = filteredResults.filter(function(thisPost){
                    return String(thisPost.author._id) === String(userId);
                });
            }

            // FILTER out posts that are created more than X time ago (X is in UTC timestamp format)
            if( timestamp ){
                filteredResults = filteredResults.filter(function(thisPost){
                    return thisPost.createdAt >= timestamp;
                });
            }

            res.json({ message: 'Retrieved posts from search query!', data: filteredResults });

        })
        .catch(function(err){
            res.send(err);
        });
};