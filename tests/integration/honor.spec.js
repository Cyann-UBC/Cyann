const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');

before(populateUsers);
after(clearUsers);

describe("[API ROUTE] /api/honor/:userId", () => {

  it('should return UNAUTHORIZED error (missing JWT)', (done) => {
    request(app)
      .get('/api/honor/'+users[0]._id)
      .expect(401)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "No authorization token was found",
          "error": {
            "name": "UnauthorizedError",
            "message": "No authorization token was found",
            "code": "credentials_required",
            "status": 401,
            "inner": {
              "message": "No authorization token was found"
            }
          }
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
          "message": users[0].name,
          "honorPoints": users[0].honour,
        });
      })
      .end(done);
  });

  it('should NOT return the user\'s honor points (invalid :userId)', (done) => {
    const invalidUserId = "0"
    request(app)
      .get(`/api/honor/${invalidUserId}`)
      .set('Authorization', `Bearer ${user_tokens[0]}`)
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "User not found",
          "status" : 400,
        });
      })
      .end(done);
  });
});