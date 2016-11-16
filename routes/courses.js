var Courses = require("../models/course.js");
var Users = require("../models/user.js");

//Find all post
exports.findAll = function(req,res){
    Courses.find()
        .select("-posts -__v")
        .populate("instructor", "name", Users)
        .populate("TAs", "name", Users)
        .then(function (result){
            res.json({ message: "Retrieved all courses!", data: result});
        }).catch(function(err){
            res.send(err);
        });
}

//Convert a courseName to courseId
exports.findByName = function(req,res){
    Courses.findOne({"courseName": req.params.courseName})
        .select("-posts -__v")
        .populate("instructor", "name", Users)
        .then(function(result){
            res.json({ message: "Course Found!", data: result });
        }).catch(function(err){
            res.send(err);
        });
}

//Find a specific course by courseId
exports.findById = function(req,res){
    Courses.findById({ "_id": req.params.courseId })
        .select("-posts -__v")
        .populate("instructor", "name", Users)
        .then(function (result){
            res.json({ message: "Course Found!", data: result });
        }).catch(function(err){
            res.send(err);
        });aa
}

// CREATE COURSE
exports.create = function(req,res){
    var newCourse = { courseName: req.body.courseName,
                     instructor: req.body.instructor,
                     TAs: req.body.TAs.split(" ").filter(onlyUnique) };
    Courses.create(newCourse)
        .then(function (result){
            res.json({ message: "Course created!", data: result });
        }).catch(function(err){
            res.send(err);
        });
};
// Helper Method for FILTER()
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

exports.updateById = function(req,res){
    var courseId = req.params.courseId;
    Courses.findOne({'_id': courseId})
        .then(function(result){
            if (req.body.TAs != null) 
                for (var i = 0; i < req.body.TAs.length; i++)
                    result.TAs.push(req.body.TAs[i]);
            if (req.body.instructor != null)
                for (var i = 0; i < req.body.instructor.length; i++)
                    result.instructor.push(req.body.instructor[i]);
            return result.save();
        })
        .then(function (result){
            res.json({ message: 'Updated course #'+courseName+'', data: result });
        }).catch(function(err){
            res.send(err);
        });
};

exports.addUser = function(req,res){
    var courseId = req.params.courseId;
    Courses.findById({'_id': courseId})
        .then(function(result){
            for (var i = 0; i < result.users.length; i++) {
                if (result.users[i] == req.user.userId)
                    return result;
            }
            result.users.push(req.user.userId);
            return result.save();
        })
        .then(function (result){
            res.json({ data: result });
        }).catch(function(err){
            res.send(err);
        });
};
