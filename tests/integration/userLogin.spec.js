const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

var app = require('./../../server.js').app;
const {populateUsers, clearUsers, users, user_tokens} = require('./../fixtures/fixtures-user.js');

before(clearUsers);

describe("[API ROUTE] /api/users/register", () => {

  var email = users[0].email, 
      // userType = users[0].userType, 
      userType = "student", 
      socialToken = users[0].socialToken,
      profileImg = users[0].profileImg,
      facebookId = users[0].facebookId;

  it('should return a JWT Token (new user)', (done) => {
    request(app)
      .post('/api/users/register')
      .send({ email, socialToken, profileImg })
      .expect(200)
      .expect((res) => {
        // Check response body
        expect(res.body).toInclude({
          "message": "token assigned",
          "userType": userType,
        });

        // Decode JWT & check token's payload
        var decoded = jwt.decode(res.body.jwt, {complete: true});
        expect(decoded.payload).toInclude({
          facebookId: facebookId,
          userType: userType
        });
      })
      .end(done);
  });

  it('should return a JWT Token (existing user)', (done) => {
    request(app)
      .post('/api/users/register')
      .send({ email, socialToken, profileImg })
      .expect(200)
      .expect((res) => {
        // Check response body
        expect(res.body).toInclude({
          "message": "token assigned",
          "userType": userType,
        });

        // Decode JWT & check token's payload
        var decoded = jwt.decode(res.body.jwt, {complete: true});
        expect(decoded.payload).toInclude({
          facebookId: facebookId,
          userType: userType
        });
      })
      .end(done);
  });

  it('should NOT return a JWT Token ("email" param missing)', (done) => {
    request(app)
      .post('/api/users/register')
      .send({ socialToken, profileImg })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "Either 'email' or 'profileImg' or 'socialToken' param is missing",
          "status": 400
        });
      })
      .end(done);
  });

  it('should NOT return a JWT Token ("socialToken" param missing)', (done) => {
    request(app)
      .post('/api/users/register')
      .send({ email, profileImg })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "Either 'email' or 'profileImg' or 'socialToken' param is missing",
          "status": 400
        });
      })
      .end(done);
  });

  it('should NOT return a JWT Token ("profileImg" param missing)', (done) => {
    request(app)
      .post('/api/users/register')
      .send({ email, socialToken })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "Either 'email' or 'profileImg' or 'socialToken' param is missing",
          "status": 400
        });
      })
      .end(done);
  });

  it('should NOT return a JWT Token (invalid socialToken)', (done) => {
    let invalidSocialToken = "fakeToken"
    request(app)
      .post('/api/users/register')
      .send({ email, socialToken: invalidSocialToken, profileImg })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "The Facebook Access Token provided is either invalid or expired",
          "status": 400
        });
      })
      .end(done);
  });

  it('should NOT return a JWT Token (expired socialToken)', (done) => {
    let expiredSocialToken = "EAACEdEose0cBAANFsxGi6uCETgiJNBtzgsNFPK9bXTFBRUgUumFqaiEOvVosdLsv9lA2yXZChZCSXdNBdDFaqb8iX4SgVxbTqGEeaUL3bX5z3EmafHU3ioF9UJUZCBdiJABbHSN4s6ZBqW5Tj9O6eTZABk8GBvHtPf0QpheaxnQZDZD"
    request(app)
      .post('/api/users/register')
      .send({ email, socialToken: expiredSocialToken, profileImg })
      .expect(400)
      .expect((res) => {
        expect(res.body).toInclude({
          "message": "The Facebook Access Token provided is either invalid or expired",
          "status": 400
        });
      })
      .end(done);
  });
});