const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index'); //  index.js file is in the parent directory

chai.use(chaiHttp);
const expect = chai.expect;

describe('index.js', () => {
  it('should respond with "api running" on GET /', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('api running');
        done();
      });
  });

  // Add more test cases for other routes and functionalities
});