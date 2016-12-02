const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');
const {populateCourses, clearCourses, courses} = require('./../fixtures/fixtures-course.js');

describe("<<<<<<<<<<<< COURSES API >>>>>>>>>>>>", () => {
  describe("[GET] /api/courses", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get('/api/courses/')
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should return a list of all courses', (done) => {
      request(app)
        .get('/api/courses/')
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: [ { 
                _id: '000000000000000000000001', 
                courseName: 'TEST_COURSE_A', 
                instructor: [ { _id: '400000000000000000000000', email: 'sathish_hieudbn_gopalakrishnan@tfbnw.net', name: 'Sathish Gopalakrishnan', profileImg: 'https://static.xx.fbcdn.net/image3.png', userType: 'instructor' } ], 
                TAs: [ { _id: '300000000000000000000000', email: 'chen_pzmpdbi_chen@tfbnw.net', name: 'Chen Chen', profileImg: 'https://static.xx.fbcdn.net/image2.png', userType: 'student' } ], 
                users: [ '100000000000000000000000', '200000000000000000000000' ] 
              }, 
              { 
                _id: '000000000000000000000002', 
                courseName: 'TEST_COURSE_B', 
                instructor: [], 
                TAs: [], 
                users: [] 
              } 
            ], 
            message: 'Retrieved all courses!' 
          });
        })
        .end(done);
    });
  });

  describe("[GET] /api/courses/:courseId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/${courses[1]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return course data', (done) => {
      request(app)
        .get(`/api/courses/${courses[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { TAs: [], _id: '000000000000000000000002', courseName: 'TEST_COURSE_B', instructor: [], users: [] }, 
            message: 'Course Found!' 
          });
        })
        .end(done);
    });

    it('should return course data (DB doesn\'t have entry corresponding to :courseId)', (done) => {
      request(app)
        .get(`/api/courses/000000000000000000000000`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(404)
        .expect((res) => {
          expect(res.body).toInclude({ 
            error: { status: 404 }, 
            message: 'RESOURCE_NOT_FOUND' 
          });
        })
        .end(done);
    });
  });

  describe("[GET] /api/courses/users/:courseId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/users/${courses[1]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should return list of users registered to course', (done) => {
      request(app)
        .get(`/api/courses/users/${courses[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ __v: 0, _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', facebookId: '103837213438033', honor: 0, name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/image0.png', userType: 'student' })
          expect(res.body).toInclude({ __v: 0, _id: '200000000000000000000000', email: 'howard_pyabina_zhou@tfbnw.net', facebookId: '108546649632736', honor: 0, name: 'Howard Zhou', profileImg: 'https://static.xx.fbcdn.net/image1.png', userType: 'student' })
        })
        .end(done);
    });
  });

  describe("[POST] /api/courses/", () => {
    before(populateUsers);
    before(clearCourses);
    after(clearUsers);
    after(clearCourses);

    var courseName = 'TEST_COURSE_C',
        instructor = ['000000000000000000000004'],
        TAs = ['000000000000000000000003'];

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .post('/api/courses/')
        .send({ courseName, instructor, TAs })
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should not allow non-instructors to create a course', (done) => {
      request(app)
        .post('/api/courses/')
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ courseName, instructor, TAs })
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'Access denied!', status: 400 })
        })
        .end(done);
    });

    it('should allow an instructor to create a new course', (done) => {
      request(app)
        .post('/api/courses/')
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .send({ courseName, instructor, TAs })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: { TAs, courseName, instructor, posts: [], users: [] }, message: 'Course created!' })
        })
        .end(done);
    });
  });

  describe("[PUT] /api/courses/addUser/:courseId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/addUser/${courses[1]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should register user into the course', (done) => {
      request(app)
        .put(`/api/courses/addUser/${courses[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: { TAs: [], __v: 1, _id: '000000000000000000000002', courseName: 'TEST_COURSE_B', instructor: [], posts: [], users: [ '100000000000000000000000' ] } })
        })
        .end(done);
    });

    it('should not add registered users into the course again (i.e. double entry)', (done) => {
      request(app)
        .put(`/api/courses/addUser/${courses[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: { TAs: [], __v: 1, _id: '000000000000000000000002', courseName: 'TEST_COURSE_B', instructor: [], posts: [], users: [ '100000000000000000000000' ] } })
        })
        .end(done);
    });    
  });

  describe("[PUT] /api/courses/removeUser/:courseId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/removeUser/${courses[0]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should deregister user from the course', (done) => {
      request(app)
        .put(`/api/courses/removeUser/${courses[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: { TAs: [ '300000000000000000000000' ], __v: 1, _id: '000000000000000000000001', courseName: 'TEST_COURSE_A', instructor: [ '400000000000000000000000' ], posts: [], users: [ '200000000000000000000000' ] } })
        })
        .end(done);
    });
  });

  describe("[PUT] /api/courses/:courseId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var instructor = ['000000000000000000000005'],
        TAs = ['000000000000000000000002','000000000000000000000003'];

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[1]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should not allow non-instructors to modify a course', (done) => {
      request(app)
        .put(`/api/courses/${courses[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ instructor, TAs })
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'Access denied!', status: 400 })
        })
        .end(done);
    });

    it('should allow an instructor to modify a course', (done) => {
      request(app)
        .put(`/api/courses/${courses[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .send({ instructor, TAs })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: { TAs: [ '000000000000000000000002', '000000000000000000000003' ], __v: 1, _id: '000000000000000000000002', courseName: 'TEST_COURSE_B', instructor: [ '000000000000000000000005' ], posts: [], users: [] } })
        })
        .end(done);
    });
  });

});