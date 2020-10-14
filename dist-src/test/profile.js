"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai.default.use(_chaiHttp.default);

_chai.default.should();

let token1;
let token2;
let token3;
describe('PROFILE', () => {
  before(done => {
    const user1 = {
      email: 'admin@gmail.com',
      password: 'mypassword'
    };

    _chai.default.request(_index.default).post('/api/v1/auth/login').send(user1).then(res => {
      token1 = res.body.token;
      done();
    }).catch(err => {
      throw err;
    });
  });
  before(done => {
    const user2 = {
      email: 'superadmin@gmail.com',
      password: 'mypassword'
    };

    _chai.default.request(_index.default).post('/api/v1/auth/login').send(user2).then(res => {
      token2 = res.body.token;
      done();
    }).catch(err => {
      throw err;
    });
  });
  before(done => {
    const user3 = {
      email: 'test@gmail.com',
      password: 'mypassword'
    };

    _chai.default.request(_index.default).post('/api/v1/auth/login').send(user3).then(res => {
      token3 = res.body.token;
      done();
    }).catch(err => {
      throw err;
    });
  });
  describe('POST /profile/edit_profile', () => {
    it('should generate token', done => {
      token1.should.be.a('string');
      token2.should.be.a('string');
      done();
    });
    it('should change user password', () => {
      const user = {
        token: token3,
        oldPassword: 'mypassword',
        newPassword: 'password'
      };
      return _chai.default.request(_index.default).post('/api/v1/profile/change_password').send(user).set('Authorization', token3).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Password reset successfull');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if old password did not match', () => {
      const user = {
        token: token3,
        oldPassword: 'mypass',
        newPassword: 'password'
      };
      return _chai.default.request(_index.default).post('/api/v1/profile/change_password').send(user).set('Authorization', token3).then(res => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('failed');
        res.body.should.have.property('errors').eql('Passwords do not match');
      }).catch(err => {
        throw err;
      });
    });
    it('should change password a number of times', () => {
      const user = {
        token: token3,
        oldPassword: 'password',
        newPassword: 'mypassword'
      };
      return _chai.default.request(_index.default).post('/api/v1/profile/change_password').send(user).set('Authorization', token3).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('Password reset successfull');
      }).catch(err => {
        throw err;
      });
    });
    it('should edit user profile', () => {
      const user = {
        token: token3,
        name: 'Mr Nelson',
        email: 'test1@gmail.com',
        phone: '08076565478',
        address: 'ghost street'
      };
      return _chai.default.request(_index.default).post('/api/v1/profile/edit_profile').send(user).set('Authorization', token3).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('Success');
        res.body.should.have.property('message').eql('Profile Update Successful');
        res.body.should.have.property('newProfile').to.be.a('object');
      }).catch(err => {
        throw err;
      });
    });
    it('should edit user profile multiple times', () => {
      const user = {
        token: token3,
        name: 'Mr Nelson test',
        email: 'test@gmail.com',
        phone: '09076565478',
        address: 'ghost street!'
      };
      return _chai.default.request(_index.default).post('/api/v1/profile/edit_profile').send(user).set('Authorization', token3).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('Success');
        res.body.should.have.property('message').eql('Profile Update Successful');
        res.body.should.have.property('newProfile').to.be.a('object');
      }).catch(err => {
        throw err;
      });
    });
  });
  describe('GET /profile', () => {
    it('should get loggedin user profile', () => {
      return _chai.default.request(_index.default).get('/api/v1/profile').send().set('Authorization', token3).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('Success');
        res.body.should.have.property('profile').to.be.a('object');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if user tries to login with wrong token', () => {
      const token4 = '#wrong token';
      return _chai.default.request(_index.default).get('/api/v1/profile').send().set('Authorization', token4).then(res => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Failed to authenticate');
        res.body.should.have.property('err').eql('Session expired');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if user is not logged in', () => {
      return _chai.default.request(_index.default).post('/api/v1/profile').then(res => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('No Token Passed');
      }).catch(err => {
        throw err;
      });
    });
  });
});