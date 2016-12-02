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
    posts: [
      {
        _id: '000000000000000000000010',
        title: 'TEST_POST_A',
        content: 'TEST_POST_A_CONTENT',
        course: '000000000000000000000001',
        author: '100000000000000000000000',
        createdAt: '2016-12-01T17:59:27.331Z',
        updatedAt: '2016-12-01T17:59:27.331Z',
        comments: [
          {
            _id: '000000000000000000000100',
            content: 'TEST_COMMENT_A',
            course: '000000000000000000000001',
            author: '100000000000000000000000',
            createdAt: '2016-12-01T17:59:30.331Z',
            updatedAt: '2016-12-01T17:59:30.331Z',
            isAnswer: false,
            upvotes: 0,
            upvotedUsers: [],
          },           
          {
            _id: '000000000000000000000200',
            content: 'TEST_COMMENT_B',
            course: '000000000000000000000001',
            author: '200000000000000000000000',
            createdAt: '2016-12-01T18:00:27.331Z',
            updatedAt: '2016-12-01T18:00:27.331Z',
            isAnswer: true,
            upvotes: 3,
            upvotedUsers: [ '100000000000000000000000', 
                            '300000000000000000000000',  
                            '400000000000000000000000' ]
          }
        ]
      }
    ]
  }
];

// Create function to load database
const populateCourses = (done) => {
  Course.remove({}).then(() => {
    var course_1 = new Course(courses[0]).save();

    return Promise.all([course_1])
  }).then(() => done());
};

// Create function to load database
const clearCourses = (done) => {
  Course.remove({}).then(() => done());
};

module.exports = {populateCourses, clearCourses, courses};