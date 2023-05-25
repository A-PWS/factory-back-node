const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming you've exported your app object
const expect = chai.expect;
const testData = require('./testData.js');
require('./index.test.js');


chai.use(chaiHttp);

describe('Auth Routes', () => {
  describe('POST /register', () => {
    it('should register a new user', (done) => {
      chai
        .request(app)
        .post('/register')
        .send({
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ code: 1, message: 'Success' });
          done();
        });
    });

    it('should return an error for duplicate email', (done) => {
      chai
        .request(app)
        .post('/register')
        .send({
          name: 'Jane Doe',
          email: 'john.doe@example.com',
          password: 'password456'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ code: 2, message: 'Email is Taken' });
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  let token; // Variable to store the token

  describe('POST /login', () => {
    it('should login an existing user', (done) => {
      chai
        .request(app)
        .post('/login')
        .send({
          email: 'john.doe@example.com',
          password: 'password123'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          expect(res.body).to.have.property('user_details');

          token = res.body.token; // Store the token in the variable

          testData.setToken(res.body.token); // Store the token using setToken


          // Add more assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /logout/:token', () => {
    it('should log out the user', (done) => {

      chai
        .request(app)
        .get(`/logout/${token}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.equal({ code: 1, message: 'Logged out' });
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('DELETE /deleteUser', () => {
    it('should delete a user', (done) => {
      chai
      .request(app)
      .delete(`/deleteUser`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ code: 1, message: 'Deleted User' });
        done();
      });
    });
  });

  // Add more test cases for other routes and functionalities
});
