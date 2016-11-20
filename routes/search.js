var Courses = require("../models/course.js");
var Users = require("../models/user.js");

/*
  param: courseId
  query: keyword, userId, weeksAgo
  usage: Filters out all posts in the the specified course that
    - doesn't have it's contents or title matching KEYWORD
    - not authored by USER-ID
    - not within X number of weeksAgo
*/
exports.searchPosts = function(req,res){

    var keyword = req.query.keyword;
    var userId = req.query.userId;
    // var timestamp = req.query.timestamp; // UTC timestamp
    var weeksAgo = +req.query.weeksAgo; // '+' sign helps to convert param from STRING to INT

    // Check if weeksAgo is an integer
    if( isNotAnInteger(weeksAgo) || weeksAgo <= 0 ){
        res.status(400);
        res.json({ message: '[weeksAgo] param is not a positive, non-zero integer' });
    }

    Courses.findById({ '_id': req.params.courseId })
        .select("-__v")
        .populate("instructor", "name email profileImg userType", Users)
        .populate("posts.author", "name email profileImg userType", Users)
        .populate("posts.comments.author", "name email profileImg userType", Users)
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

            // // FILTER out posts that are created more than X time ago (X is in UTC timestamp format)
            // if( timestamp ){
            //     filteredResults = filteredResults.filter(function(thisPost){
            //         return thisPost.createdAt >= timestamp;
            //     });
            // }

            // FILTER out posts that are created more than X number of weeks ago
            if( weeksAgo ){
                filteredResults = filteredResults.filter(function(thisPost){
                    return thisPost.createdAt >= (new Date().getTime() - weeksAgo * (1000*60*60*24*7));
                });
            }

            res.json({ message: 'Retrieved posts from search query!', data: filteredResults });

        })
        .catch(function(err){
            res.send(err);
        });
};

/*
  Checks if the given javascript variable is an integer or not

  Returns: TRUE if expression is NOT an integer, FALSE otherwise
*/
function isNotAnInteger( expression ){
    return ( isNaN(expression) || parseInt(expression) != expression );
}