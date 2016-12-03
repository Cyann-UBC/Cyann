const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');

describe("<<<<<<<<<<<< HONOR API >>>>>>>>>>>>", () => {
  describe("[GET] /api/honor/:userId", () => {
    before(populateUsers);
    after(clearUsers);

    it('should return UNAUTHORIZED error (missing JWT)', (done) => {
      request(app)
        .get(`/api/honor/${users[0]._id}`)
        .expect(401)
        .expect((res) => {
          expect(res.body).toInclude({
            "message": "No authorization token was found",
            "error": { "name": "UnauthorizedError", "message": "No authorization token was found", "code": "credentials_required", "status": 401, "inner": { "message": "No authorization token was found" }}
          })
        })
        .end(done);
    });

    it('should return the user\'s honor points', (done) => {
      request(app)
        .get(`/api/honor/${users[0]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toInclude({
            "userName": users[0].name,
            "honorPoints": users[0].honour,
          });
        })
        .end(done);
    });

    it('should NOT return the user\'s honor points (invalid :userId)', (done) => {
      const invalidUserId = "12345"
      request(app)
        .get(`/api/honor/${invalidUserId}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ kind: 'ObjectId', name: 'CastError', path: '_id', value: '12345' });
        })
        .end(done);
    });

    it('should NOT return the user\'s honor points if user is an instructor', (done) => {
      request(app)
        .get(`/api/honor/${users[4]._id}`)
        .set('Authorization', `Bearer ${user_tokens[0]}`)
        .expect(400)
        .expect((res) => {
          expect(res.body).toInclude({ message: 'Access denied!', status: 400 });
        })
        .end(done);
    });
  });
});