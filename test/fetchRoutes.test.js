const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming you've exported your app object
const expect = chai.expect;
const testData = require('./testData');
require('./auth.test.js');


chai.use(chaiHttp);

describe('Shift Report Routes', () => {
  describe('GET /getShiftReport', () => {
    it('should get the shift report', (done) => {
      chai
        .request(app)
        .get('/getShiftReport')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /getShiftReportReject', () => {
    it('should get the shift report for rejects', (done) => {
      chai
        .request(app)
        .get('/getShiftReportReject')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /hourBreakDown', () => {
    it('should get the hour breakdown', (done) => {
      chai
        .request(app)
        .get('/hourBreakDown')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /hourBreakDownQuntity', () => {
    it('should get the hour breakdown for quantity', (done) => {
      chai
        .request(app)
        .get('/hourBreakDownQuntity')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /getDailyReject', () => {
    it('should get the daily reject report', (done) => {
      chai
        .request(app)
        .get('/getDailyReject')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  // Add more test cases for other routes and functionalities
});