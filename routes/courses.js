var Course  =   require("../models/mongo");

// //Find all courses

// exports.findPostsById = function(req,res){
//   var courseId = req.params.courseId;
//   var promise = Course.findById(courseId, '_id courseNum posts');
//   promise.then(function(result){
//     var promise = forumPosts.find({"course":result.courseNum}, 'id content author title comments created upvotes downvotes')
//     promise.then(function(result){
//       res.json({message:result})
//     }).catch(function(err){
//       res.send(err);
//     })
//   }).catch(function(err){
//     res.send(err);
//   })
// }
//
// exports.findStudentById = function(req,res){
//
// }

//Find all post
exports.findAll = function(req,res){
  var promise = Course.find( {}, 'courseName instructor TAs posts' );
  promise.then(function (result){
      res.json({ message: 'Retrieved all courses!', data: result });
  }).catch(function(err){
      res.send(err);
  });
}

exports.findById = function(req,res){
  res.json(req.course)
}

// CREATE POST
exports.create = function(req,res){
    var newCourse = new Course();           // create a new instance of the POST model
    newCourse.courseName = req.body.courseName;
    newCourse.instructor = req.body.instructor;
    newCourse.TAs        = req.body.TAs;
    var promise = newCourse.save();
    promise.then(function (result){
        res.json({ message: 'Course created!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};
