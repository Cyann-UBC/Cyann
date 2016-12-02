const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');
const {populateCourses, clearCourses, courses} = require('./../fixtures/fixtures-post.js'); // Note that we're using a different fixture

describe("<<<<<<<<<<<< POSTS API >>>>>>>>>>>>", () => {
  describe("[API ROUTE] GET /api/courses/:courseId/posts", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts`)
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
        .get(`/api/courses/${courses[0]._id}/posts`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: [ 
              { _id: '000000000000000000000010', author: { _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/1TFLnx1w5F2.png', userType: 'student' }, comments: [], content: 'TEST_POST_A_CONTENT', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:27.331Z', title: 'TEST_POST_A', updatedAt: '2016-12-01T17:59:27.331Z' }, 
              { _id: '000000000000000000000020', author: { _id: '200000000000000000000000', email: 'howard_pyabina_zhou@tfbnw.net', name: 'Howard Zhou', profileImg: 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/1TFLnx1w5F2.png', userType: 'student' }, comments: [], content: 'TEST_POST_B_CONTENT', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:27.329Z', title: 'TEST_POST_B', updatedAt: '2016-12-01T17:59:27.329Z' } 
            ],
            message: 'Retrieved All Posts!' 
          });
        })
        .end(done);
    });
  });

  describe("[API ROUTE] GET /api/courses/:courseId/posts/:postId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return post data', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000010', author: { _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/1TFLnx1w5F2.png', userType: 'student' }, comments: [], content: 'TEST_POST_A_CONTENT', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:27.331Z', title: 'TEST_POST_A', updatedAt: '2016-12-01T17:59:27.331Z' }, 
            message: 'Post retrieved' 
          });
        })
        .end(done);
    });
  });

  describe("[API ROUTE] POST /api/courses/:courseId/posts", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var title = "TEST_POST_C",
        content = "TEST_POST_C_CONTENT";

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts`)
        .send({title, content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    
    it('should create a post', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts`)
        .send({title, content})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            user: { __v: 0, _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', facebookId: '103837213438033', honor: 0, name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/1TFLnx1w5F2.png', userType: 'student' },
            message: 'post created and user updated, no email sent'
          });
        })
        .end(done);
    });

    it('should create a post & send an email if an instructor created the post', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts`)
        .send({title, content})
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ message:'posted created and email sent' });
        })
        .end(done);
    });

    it('should NOT create a post ("title" param missing)', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts`)
        .send({content})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            status: 400,
            message: 'MISSING_PARAM'
          });
        })
        .end(done);
    });

    it('should NOT create a post ("content" param missing)', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts`)
        .send({title})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            status: 400,
            message: 'MISSING_PARAM'
          });
        })
        .end(done);
    });
  });

  describe("[API ROUTE] PUT /api/courses/:courseId/posts/:postId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var title = "NEW_TEST_POST_A",
        content = "NEW_TEST_POST_A_CONTENT";

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({title, content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
      
    it('should edit a post if user is the post\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({title, content})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { conent: 'NEW_TEST_POST_A_CONTENT', title: 'NEW_TEST_POST_A' }, 
            message: 'Updated post #000000000000000000000010!' 
          });
        })
        .end(done);
    });

    it('should NOT edit a post if user is not an instructor and the post\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({title, content})
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the POST' });
        })
        .end(done);
    });

    it('should NOT edit a post if user is an instructor but not the post\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({title, content})
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the POST' });
        })
        .end(done);
    });

    it('should NOT edit a post ("title" param missing)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({content})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            status: 400,
            message: 'MISSING_PARAM'
          });
        })
        .end(done);
    });

    it('should NOT edit a post ("content" param missing)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .send({title})
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            status: 400,
            message: 'MISSING_PARAM'
          });
        })
        .end(done);
    });
  });

  describe("[API ROUTE] DELETE /api/courses/:courseId/posts/:postId", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
      
    it('should delete a post if user is the post\'s author', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'Post deleted and user updated' });
        })
        .end(done);
    });

    it('should delete a post if user is an instructor', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'Post deleted and user updated' });
        })
        .end(done);
    });

    it('should NOT delete a post if user neither an instructor nor the post\'s author', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to delete the POST' });
        })
        .end(done);
    });
  });
});