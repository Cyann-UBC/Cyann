const {ObjectID} = require('mongodb');
const Course = require('./../../models/course.js');

// Generate list of user objects
const courses = [
  { 
    _id: '000000000000000000000001', 
    courseName: 'TEST_COURSE_A', 
    instructor: ['400000000000000000000000'], 
    TAs: ['300000000000000000000000'], 
    users: ['100000000000000000000000',
            '200000000000000000000000'],
    posts: []
  }, 
  { 
    _id: '000000000000000000000002', 
    courseName: 'TEST_COURSE_B', 
    instructor: [],  
    TAs: [], 
    users: [],
    posts: []
  }
];

// Create function to load database
const populateCourses = (done) => {
  Course.remove({}).then(() => {
    var course_1 = new Course(courses[0]).save();
    var course_2 = new Course(courses[1]).save();

    return Promise.all([course_1, course_1])
  }).then(() => done());
};

// Create function to load database
const clearCourses = (done) => {
  Course.remove({}).then(() => done());
};

module.exports = {populateCourses, clearCourses, courses};