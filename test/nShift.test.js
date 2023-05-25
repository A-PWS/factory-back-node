const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); // Assuming you've exported your app object
require('./auth.test.js');
const expect = chai.expect;
const testData = require('./testData');

chai.use(chaiHttp);

describe('N Shifts Routes', () => {
  describe('GET /n_shifts', () => {
    it('should return n shifts data', (done) => {
      chai
        .request(app)
        .get('/n_shifts')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add more assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  let shiftId;

  describe('POST /addn_shifts', () => {
    it('should add a new n shift', (done) => {
      chai
        .request(app)
        .post('/addn_shifts')
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .send({
          shiftType: 'Morning',
          date: '2023-05-24',
          carderCount: 10,
          manPower: 5,
          lowCarderCountReason: 'Insufficient staff',
          productType: 'Type A'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.deep.include({ code: 1, message: 'Success' });

          shiftId = res.body.resultSql.insertId; 
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  describe('GET /getOneShift/:shifId', () => {
    it('should return a specific n shift', (done) => {
      const shift_Id = shiftId; // inserted shift ID

      chai
        .request(app)
        .get(`/getOneShift/${shift_Id}`)
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add more assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });
  describe('DELETE /deleteShift/:id', () => {
    it('should DELETE THE TEST Shift', (done) => {
      const shift_Id = shiftId; // inserted shift ID

      chai
        .request(app)
        .delete(`/deleteShift/${shift_Id}`)
        .set('Authorization', `Bearer ${testData.getToken()}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          // Add more assertions for the expected response
          done();
        });
    });

    // Add more test cases for different scenarios
  });

  // Add more test cases for other routes and functionalities
});
