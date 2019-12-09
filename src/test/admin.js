import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Pool from '../helpers/dbConnection';

chai.use(chaiHttp);
chai.should();
let token1; let token2;
describe('Administration', () => {
  before((done) => {
    const user1 = {
      email: 'admin@gmail.com',
      password: 'mypassword',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user1)
      .then((res) => {
        token1 = res.body.token;
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  before((done) => {
    const user2 = {
      email: 'superadmin@gmail.com',
      password: 'mypassword',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user2)
      .then((res) => {
        token2 = res.body.token;
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  describe('POST /admin/create/:userId', () => {
    it('should generate token', (done) => {
      token1.should.be.a('string');
      token2.should.be.a('string');
      done();
    });
    it('should Remove admin privileges from user', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .post(`/api/v1/admin/remove/${user.userId}`)
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('message').eql('Admin modified Successfully');
          res.body.should.have.property('oldAdmin').to.be.a('object');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should throw an error if user is not admin', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .post(`/api/v1/admin/remove/${user.userId}`)
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('failed');
          res.body.should.have.property('message').eql('User does not have admin privilege');
          res.body.should.have.property('name').to.be.a('string');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should Make a user an admin', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .post(`/api/v1/admin/create/${user.userId}`)
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('message').eql('New Admin Created Successfully');
          res.body.should.have.property('newAdmin').to.be.a('object');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should throw error if a user is already an admin', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .post(`/api/v1/admin/create/${user.userId}`)
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('failed');
          res.body.should.have.property('message').eql('User already have admin privilege');
          res.body.should.have.property('name').to.be.a('string');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should throw error if a user is not found', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09oi89-98077yujh',
      };
      return chai.request(app)
        .post(`/api/v1/admin/create/${user.userId}`)
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error').to.be.a('object');
          res.body.error.should.have.property('name').eql('error');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should throw error if logged in user is not the super admin', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .post(`/api/v1/admin/create/${user.userId}`)
        .send()
        .set('Authorization', token1)
        .then((res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Access Denied');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('GET /admin/users', () => {
    it('should get all users', () => {
      return chai.request(app)
        .get('/api/v1/admin/users')
        .send()
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('users').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should get a user by userId', () => {
      const user = {
        token: token1,
        userId: '55002f80-545f-48d5-900f-53350a2a6d09',
      };
      return chai.request(app)
        .get(`/api/v1/admin/${user.userId}`)
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('user').to.be.a('object');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should throw error is a user is not found', () => {
      const user = {
        token: 'xdfgfhbbbjjjnnnm',
        userId: '55002f80-545f-48d5-900f-533klmkjwjwjweoko50a2a6d09',
      };
      return chai.request(app)
        .get(`/api/v1/admin/${user.userId}`)
        .set('Authorization', token2)
        .then((res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error').to.be.a('object');
          res.body.error.should.have.property('name').eql('error');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
