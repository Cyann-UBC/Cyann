var Courses = require("../models/course.js");
var Users = require("../models/user.js");

/*
  param: courseId
  query: keyword, type, weeksAgo
  usage: Filters out all posts in the the specified course that
    - doesn't have it's contents or title matching KEYWORD
    - not authored by USER-ID
    - not within X number of weeksAgo
*/
exports.searchPosts = function(req,res){

    var keyword = req.query.keyword.toLowerCase();
    var type = req.query.type; // type=instructor, type=me
    // var timestamp = req.query.timestamp; // UTC timestamp
    var weeksAgo = +req.query.weeksAgo; // '+' sign helps to convert param from STRING to INT
    var thisUserId = req.user.userId;
    console.log(keyword)
    console.log(type)
    console.log(weeksAgo)
    // // Check if weeksAgo is an integer
    // if( weeksAgo && ( isNotAnInteger(weeksAgo) || weeksAgo <= 0 ) ){
    //     res.status(400);
    //     res.json({ message: '[weeksAgo] param is not a positive, non-zero integer' });
    // }

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
                    return thisPost.title.toLowerCase().includes(keyword) || thisPost.content.toLowerCase().includes(keyword);
                });
            }

            // FILTER out posts that isn't author'ed by the given userId
            if( type ){
                if( type === "me" ){
                    filteredResults = filteredResults.filter(function(thisPost){
                        return String(thisPost.author._id) === thisUserId;
                    });
                }
                else if( type === "instructor" ){
                    filteredResults = filteredResults.filter(function(thisPost){
                        return String(thisPost.author.userType) === String("instructor") || String(thisPost.author.userType) === String("Instructor");
                    });
                }
            }

            // // FILTER out posts that are created more than X time ago (X is in UTC timestamp format)
            // if( timestamp ){
            //     filteredResults = filteredResults.filter(function(thisPost){
            //         return thisPost.createdAt >= timestamp;
            //     });
            // }

            // FILTER out posts that are created more than X number of weeks ago
            if( weeksAgo && !isNotAnInteger(weeksAgo) && weeksAgo > 0 ){
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
