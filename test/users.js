const Users = require('../server/models').Users; // понадобиться для тестовой базы
const jwt = require('jsonwebtoken');

const CONFIG = require('../server/config/config.js');

let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../app');
let should = chai.should();

chai.use(chaiHttp);
const user = {
    email: 'test@test2222222.ru',
    password: '123456'
};

const userNoPassword = {
    email: 'test@test2222222.ru',

};
const userNoEmail = {
    password: '123456'
};
const userEmpty = {};

const userNoCorrectPassword = {
    email: 'test@test2222222.ru',
    password: '1234567'
};

const userNoCorrectEmail = {
    email: 'test@test22222222222.ru',
    password: '123456'
};

let userToken = '';
let userRefreshToken = '';

describe('User',  () => {

    it('create userNoPassword', (done) => {
        chai.request(server)
            .post('/api/users')
            .send(userNoPassword)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it('create userNoEmail', (done) => {
        chai.request(server)
            .post('/api/users')
            .send(userNoEmail)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });



    it('create user', (done) => {
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('email').eql(user.email);
                done();
            });

    });

    it('create userEmpty', (done) => {
        chai.request(server)
            .post('/api/users')
            .send(userEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it ('create user', (done)=> {
        chai.request(server)
            .post('/api/users')
            .send(user)
            .end((err,res) => {
                res.should.have.status(400);
                done();
            })
    })
    it('auth user', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('token');
                res.body.should.have.property('refreshToken');
                userToken = res.body.token;
                userRefreshToken = res.body.refreshToken;
                done();
            });

    });

    it('auth userEmpty', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(userEmpty)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it('auth userNoEmail', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(userNoEmail)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it('auth userNoPassword', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(userNoPassword)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it('auth user is not correct password', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(userNoCorrectPassword)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });

    it('auth user email not found', (done) => {
        chai.request(server)
            .post('/api/auth')
            .send(userNoCorrectEmail)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });

    });


    it('refreshToken', (done) => {
        chai.request(server)
            .post('/api/token')
            .send({})
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('No refresh token');
                done();
            });

    });

    it('new refreshToken', (done) => {
        const userTokenBody = {
            refreshToken: userRefreshToken
        };
        chai.request(server)
            .post('/api/token')
            .send(userTokenBody)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('New Token and RefreshToken');
                done();
            });

    });

    it('refreshToken expired', (done) => {
        const tokenExpired = jwt.sign({name: user}, CONFIG.jwtSecret, {expiresIn: 0});
        const userTokenBody = {
            refreshToken: tokenExpired
        };
        chai.request(server)
            .post('/api/token')
            .send(userTokenBody)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property('type').eql('TokenExpiredError');
                res.body.should.have.property('messages').eql('jwt expired');
                done();
            });

    });


    it ('delete test user', (done) => {
        Users.findOne({
            where: {email: user.email}
        }).then(user => {
            user.destroy();
            done();
        });
    })

});
