var Course  =   require("../models/mongo");


//Find all post
exports.findAll = function(req,res){
  var promise = Course.find( {}, 'courseName instructor TAs posts' );
  promise.then(function (result){
      res.json({ message: 'Retrieved all courses!', data: result });
  }).catch(function(err){
      res.send(err);
  });
}

//Convert a courseName to courseId
exports.findByName = function(req,res){
  var courseName = req.params.courseName
  var promise = Course.findOne({'courseName':courseName})
  promise.then(function(result){
    console.log(result._id)
    res.json({courseId:result._id})
  }).catch(function(err){
    res.send(err);
  })
}

//Find a specific course by courseId
exports.findById = function(req,res){
  var courseId = req.params.courseId;
  var promise = Course.findById(courseId);
  promise.then(function (result){
      res.json({ message: 'Course', data: result });
  }).catch(function(err){
      res.send(err);
    });
}

// CREATE course
exports.create = function(req,res){
    var newCourse = new Course();           // create a new instance of the POST model
    newCourse.courseName = req.body.courseName;
    if (req.body.instructor != "")          // when a course is created, instructor can be empty
      newCourse.instructor = req.body.instructor;
    if (req.body.TAs != "")                 // when a course is created, TAs can be empty
      newCourse.TAs = req.body.TAs;
    var promise = newCourse.save();
    promise.then(function (result){
        res.json({ message: 'Course created!', data: result });
    }).catch(function(err){
        res.send(err);
    });
};


exports.updateById = function(req,res){
    var courseId = req.params.courseId;
    Course.findOne({'_id': courseId}).exec()
      .then(function(result){
        if (req.body.TAs != "")
          result.TAs.push(req.body.TAs);
        if (req.body.TAs != "") 
          result.instructor.push(req.body.instructor);
        return result.save();
      })
      .then(function (result){
        res.json({ message: 'Updated course #'+courseName+'', data: result });
      }).catch(function(err){
        res.send(err);
      });
};
