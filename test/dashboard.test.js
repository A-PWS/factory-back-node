const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming you've exported your app object
const expect = chai.expect;
require('./auth.test.js');
const testData = require('./testData');

chai.use(chaiHttp);

describe('Dashboard Routes', () => {
  describe('GET /dashboardAVG', () => {
    it('should get the average dashboard data', (done) => {
      chai
        .request(app)
        .get('/dashboardAVG')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /dashboardTotalProductionUpToDate', () => {
    it('should get the total production up to date', (done) => {
      chai
        .request(app)
        .get('/dashboardTotalProductionUpToDate')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /dashboardTotalRejectionUpToDate', () => {
    it('should get the total rejection up to date', (done) => {
      chai
        .request(app)
        .get('/dashboardTotalRejectionUpToDate')
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

// Run other test files or test cases after the dashboard tests
// ...
