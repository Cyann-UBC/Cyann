const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');
const {populateCourses, clearCourses, courses} = require('./../fixtures/fixtures-comment.js'); // Note that we're using a different fixture

describe("<<<<<<<<<<<< USERINFO API >>>>>>>>>>>>", () => {
  describe("[GET] /api/users/my", () => {
    before(populateUsers);
    after(clearUsers);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/users/my`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return user\'s profile data (userType == student)', (done) => {
      request(app)
        .get(`/api/users/my`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            userInfo: { __v: 0, _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', facebookId: '103837213438033', honor: 0, name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/image0.png', userType: 'student' }
          });
        })
        .end(done);
    });

    it('should return user\'s profile data (userType == instructor)', (done) => {
      request(app)
        .get(`/api/users/my`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            userInfo: { __v: 0, _id: '400000000000000000000000', email: 'sathish_hieudbn_gopalakrishnan@tfbnw.net', facebookId: '108599872960752', honor: 0, name: 'Sathish Gopalakrishnan', profileImg: 'https://static.xx.fbcdn.net/image3.png', userType: 'instructor' }
          });
        })
        .end(done);
    });
  });
  describe("[GET] /api/users/my/posts", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/users/my/posts`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return user\'s list of created posts (user has created a post)', (done) => {
      request(app)
        .get(`/api/users/my/posts`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(1)
          expect(res.body).toInclude(
            { _id: '000000000000000000000010', content: 'TEST_POST_A_CONTENT', course: { _id: '000000000000000000000001', name: 'TEST_COURSE_A' }, createdAt: '2016-12-01T17:59:27.331Z', title: 'TEST_POST_A', updatedAt: '2016-12-01T17:59:27.331Z' }
          );
        })
        .end(done);
    });

    it('should return user\'s list of created posts (user has never created a post)', (done) => {
      request(app)
        .get(`/api/users/my/posts`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(0);
        })
        .end(done);
    });
  });
  describe("[GET] /api/users/my/comments", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/users/my/comments`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return user\'s list of created comments (user has created a comment)', (done) => {
      request(app)
        .get(`/api/users/my/comments`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(1)
          expect(res.body).toInclude(
            { _id: '000000000000000000000100', content: 'TEST_COMMENT_A', course: { _id: '000000000000000000000001', name: 'TEST_COURSE_A' }, createdAt: '2016-12-01T17:59:30.331Z', post: { _id: '000000000000000000000010' }, updatedAt: '2016-12-01T17:59:30.331Z', upvotes: 0 } 
          );
        })
        .end(done);
    });

    it('should return user\'s list of created comments (user has never created a comment)', (done) => {
      request(app)
        .get(`/api/users/my/comments`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(0);
        })
        .end(done);
    });
  });
  describe("[GET] /api/users/my/courseData", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/users/my/courseData`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return user\'s list of registered courses (user has joined a course as a student)', (done) => {
      request(app)
        .get(`/api/users/my/courseData`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(1)
          expect(res.body).toInclude(
            { TAs: [ { _id: '300000000000000000000000', name: 'Chen Chen' } ], _id: '000000000000000000000001', courseName: 'TEST_COURSE_A', instructor: [ { _id: '400000000000000000000000', name: 'Sathish Gopalakrishnan' } ], postCount: 1, userCount: 2 }
          );
        })
        .end(done);
    });

    it('should return user\'s list of registered courses (user has NOT joined a course as a student)', (done) => {
      request(app)
        .get(`/api/users/my/courseData`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeA('array')
          expect(res.body.length).toEqual(0);
        })
        .end(done);
    });
  });

  describe("[GET] /api/users/getIds", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var names_2_entry = [ users[0].name, users[3].name ];
    var names_1_entry = [ users[0].name ];
    var names_1_entry_not_array = users[0].name;
    var names_invalid = [ users[0].name, 'BAD_NAME_THAT_IS_NOT_IN_DB'];

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should return a list of userId converted from a list of usernames (userType == instructor)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .send({ names: names_2_entry })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: [ { _id: users[0]._id, name: users[0].name }, { _id: users[3]._id, name: users[3].name } ]});
        })
        .end(done);
    });
    it('should return a list of userId converted from a list of usernames  (userType == student)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ names: names_2_entry })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: [ { _id: users[0]._id, name: users[0].name }, { _id: users[3]._id, name: users[3].name } ]});
        })
        .end(done);
    });
    it('should return a list of userId converted from a list of usernames  (list.length == 1)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ names: names_1_entry })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: [ { _id: users[0]._id, name: users[0].name } ]});
        })
        .end(done);
    });
    it('should return a list of userId converted from a list of usernames  (1x name, not in an Array)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ names: names_1_entry_not_array })
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ data: [ { _id: users[0]._id, name: users[0].name } ]});
        })
        .end(done);
    });
    it('should NOT return a list of userId converted from a list of usernames  ("names" param missing)', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ error: { status: 400 }, message: 'MISSING_PARAM' });
        })
        .end(done);
    });
    it('should NOT return a list of userId if not all names has a matching userId', (done) => {
      request(app)
        .get(`/api/users/getIds`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({ names: names_invalid })
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ error: { status: 400 }, message: 'INVALID_NAME(S)' });
        })
        .end(done);
    });
  });
});