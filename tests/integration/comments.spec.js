const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');
const {populateCourses, clearCourses, courses} = require('./../fixtures/fixtures-comment.js'); // Note that we're using a different fixture

describe("<<<<<<<<<<<< COMMENTS API >>>>>>>>>>>>", () => {
  describe("[GET] /api/courses/:courseId/posts/:postId/comments", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return a list of all comments', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: [ 
              { _id: '000000000000000000000100', author: { _id: '100000000000000000000000', email: 'justin_btggsjf_toh@tfbnw.net', name: 'Justin Toh', profileImg: 'https://static.xx.fbcdn.net/image0.png', userType: 'student' }, content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: false, updatedAt: '2016-12-01T17:59:30.331Z', upvotedUsers: [], upvotes: 0 }, 
              { _id: '000000000000000000000200', author: { _id: '200000000000000000000000', email: 'howard_pyabina_zhou@tfbnw.net', name: 'Howard Zhou', profileImg: 'https://static.xx.fbcdn.net/image1.png', userType: 'student' }, content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: true, updatedAt: '2016-12-01T18:00:27.331Z', upvotedUsers: [ '100000000000000000000000', '300000000000000000000000', '400000000000000000000000' ], upvotes: 3 } 
            ], 
            message: 'All COMMENT retrieved' 
          });
        })
        .end(done);
    });
  });

  describe("[GET] /api/courses/:courseId/posts/:postId/comments/:commentId", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return a comment', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: { _id: '200000000000000000000000', email: 'howard_pyabina_zhou@tfbnw.net', name: 'Howard Zhou', profileImg: 'https://static.xx.fbcdn.net/image1.png', userType: 'student' }, content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: true, updatedAt: '2016-12-01T18:00:27.331Z', upvotedUsers: [ '100000000000000000000000', '300000000000000000000000', '400000000000000000000000' ], upvotes: 3 }, 
            message: 'COMMENT retrieved' 
          });
        })
        .end(done);
    });

    it('should return a comment (DB doesn\'t have entry corresponding to :commentId)', (done) => {
      request(app)
        .get(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/000000000000000000000000`)
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

  describe("[POST] /api/courses/:courseId/posts/:postId/comments", () => {
    before(populateUsers);
    before(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var content = "TEST_COMMENT_C";

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments`)
        .send({content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should create a comment', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({content})
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            data: { author: '100000000000000000000000', content: 'TEST_COMMENT_C', course: '000000000000000000000001', isAnswer: false, upvotedUsers: [], upvotes: 0 }, 
            message: 'COMMENT created' 
          });
        })
        .end(done);
    });

    it('should NOT edit a comment ("content" param missing)', (done) => {
      request(app)
        .post(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments`)
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
  
  describe("[PUT] /api/courses/:courseId/posts/:postId/comments/:commentId", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    var content = "NEW_TEST_COMMENT_C";

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .send({content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should edit a comment if user is the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .send({content})
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'NEW_TEST_COMMENT_C', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: false, upvotedUsers: [], upvotes: 0 }, 
            message: 'COMMENT updated'
          });
        })
        .end(done);
    });
    it('should NOT edit a comment if user is not an instructor but the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .send({content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should NOT edit a comment if user is an instructor but not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .send({content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should NOT edit a comment if user is a TA but not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .send({content})
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should NOT edit a comment ("content" param missing)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
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

  describe("[DELETE] /api/courses/:courseId/posts/:postId/comments/:commentId", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should delete a comment if user is the comment\'s author', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'COMMENT deleted' 
          })
        })
        .end(done);
    });
    it('should delete a comment if user is an instructor', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'COMMENT deleted' 
          })
        })
        .end(done);
    });
    it('should NOT delete a comment if user neither an instructor nor the comment\'s author', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You do not have permissions to delete the COMMENT'
          })
        })
        .end(done);
    });
    it('should NOT delete a comment if user neither an instructor nor the comment\'s author but a TA', (done) => {
      request(app)
        .delete(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You do not have permissions to delete the COMMENT'
          })
        })
        .end(done);
    });
  });

  describe("[PUT] /api/courses/:courseId/posts/:postId/comments/:commentId/setAsAnswer", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/setAsAnswer`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should set a comment as answer if user is an instructor', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/setAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: true, upvotedUsers: [], upvotes: 0 }, 
            message: 'COMMENT flagged as an answer' 
          });
        })
        .end(done);
    });
    it('should set a comment as answer if user is a TA', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/setAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: true, upvotedUsers: [], upvotes: 0 }, 
            message: 'COMMENT flagged as an answer' 
          });
        })
        .end(done);
    });
    it('should NOT set a comment as answer if user is the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/setAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should NOT set a comment as answer if user is not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/setAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should STAY set if a comment is already set as answer', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/setAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'COMMENT is already an answer' });
        })
        .end(done);
    });
  });
  
  describe("[PUT] /api/courses/:courseId/posts/:postId/comments/:commentId/unsetAsAnswer", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/unsetAsAnswer`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should unset a comment as answer if user is an instructor', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/unsetAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: '200000000000000000000000', content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: false, upvotedUsers: [ '100000000000000000000000', '300000000000000000000000', '400000000000000000000000' ], upvotes: 3 }, 
            message: 'COMMENT unflagged as an answer' });
        })
        .end(done);
    });
    it('should unset a comment as answer if user is a TA', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/unsetAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: '200000000000000000000000', content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: false, upvotedUsers: [ '100000000000000000000000', '300000000000000000000000', '400000000000000000000000' ], upvotes: 3 }, 
            message: 'COMMENT unflagged as an answer' });
        })
        .end(done);
    });
    it('should NOT unset a comment as answer if user is the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/unsetAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should NOT unset a comment as answer if user is not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/unsetAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'You do not have permissions to edit the COMMENT' });
        })
        .end(done);
    });
    it('should STAY unset if a comment is previously not set as answer', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/unsetAsAnswer`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'COMMENT is already NOT an answer' });
        })
        .end(done);
    });
  });

  describe("[PUT] /api/courses/:courseId/posts/:postId/comments/:commentId/upvote", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/upvote`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should upvote a comment if user is an instructor', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/upvote`)
        .set('Authorization', `Bearer ${user_tokens[4]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: false, upvotedUsers: [ '500000000000000000000000' ], upvotes: 1 },
            message: 'COMMENT upvoted'
          });
        })
        .end(done);
    });
    it('should upvote a comment if user is a TA', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/upvote`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: false, upvotedUsers: [ '300000000000000000000000' ], upvotes: 1 },
            message: 'COMMENT upvoted'
          });
        })
        .end(done);
    });
    it('should upvote a comment if user is not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/upvote`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000100', author: '100000000000000000000000', content: 'TEST_COMMENT_A', course: '000000000000000000000001', createdAt: '2016-12-01T17:59:30.331Z', isAnswer: false, upvotedUsers: [ '200000000000000000000000' ], upvotes: 1 },
            message: 'COMMENT upvoted'
          });
        })
        .end(done);
    });
    it('should NOT upvote a comment if user is the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/upvote`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You cannot vote your own COMMENT'
          });
        })
        .end(done);
    });
    it('should NOT upvote a comment if user has already voted', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/upvote`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You have already voted for the COMMENT'
          });
        })
        .end(done);
    });
  });
  
  describe("[PUT] /api/courses/:courseId/posts/:postId/comments/:commentId/resetVote", () => {
    before(populateUsers);
    beforeEach(populateCourses);
    after(clearUsers);
    after(clearCourses);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/resetVote`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });
    it('should reset the votes of a comment if user is an instructor', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/resetVote`)
        .set('Authorization', `Bearer ${user_tokens[3]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: '200000000000000000000000', content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: true, upvotedUsers: [ '100000000000000000000000', '300000000000000000000000' ], upvotes: 2 }, 
            message: 'Vote for COMMENT is resetted'
          });
        })
        .end(done);
    });
    it('should reset the votes of a comment if user is a TA', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/resetVote`)
        .set('Authorization', `Bearer ${user_tokens[2]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: '200000000000000000000000', content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: true, upvotedUsers: [ '100000000000000000000000', '400000000000000000000000' ], upvotes: 2 }, 
            message: 'Vote for COMMENT is resetted'
          });
        })
        .end(done);
    });
    it('should reset the votes of a comment if user is not the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[1]._id}/resetVote`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({ 
            data: { _id: '000000000000000000000200', author: '200000000000000000000000', content: 'TEST_COMMENT_B', course: '000000000000000000000001', createdAt: '2016-12-01T18:00:27.331Z', isAnswer: true, upvotedUsers: [ '300000000000000000000000', '400000000000000000000000' ], upvotes: 2 }, 
            message: 'Vote for COMMENT is resetted'
          });
        })
        .end(done);
    });
    it('should NOT reset the votes of a comment if user is the comment\'s author', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/resetVote`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You cannot vote your own COMMENT'
          });
        })
        .end(done);
    });
    it('should NOT reset the votes of a comment if user has not voted yet', (done) => {
      request(app)
        .put(`/api/courses/${courses[0]._id}/posts/${courses[0].posts[0]._id}/comments/${courses[0].posts[0].comments[0]._id}/resetVote`)
        .set('Authorization', `Bearer ${user_tokens[1]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ 
            message: 'You have not voted for the COMMENT'
          });
        })
        .end(done);
    });
  });
});