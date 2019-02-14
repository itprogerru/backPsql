let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);


describe('/API', () => {
    it('API work', (done) => {
        chai.request(server)
            .get('/API')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('Welcome to the Api');
                done();
            });
    });
});