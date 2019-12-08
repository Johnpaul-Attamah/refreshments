import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe('User Login', () => {
  describe('POST /auth/login ', () => {
    it('Should Login User with a token', () => {
      const user = {
        email: 'test@gmail.com',
        password: 'mypassword',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('You are logged in!');
          res.body.should.have.property('token').to.be.a('string');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('Login Validations', () => {
    it('Should not Login without details', () => {
      const user = {
        email: '',
        password: '',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('Email field is required');
          res.body.should.have.property('password').eql('password field is required');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('Should not Login without password', () => {
      const user = {
        email: 'test@gmail.com',
        password: '',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('password').eql('password field is required');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('Should not Login with wrong password', () => {
      const user = {
        email: 'test@gmail.com',
        password: 'mypass',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(401);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('failed');
          res.body.should.have.property('errors').to.be.a('object');
          res.body.errors.should.have.property('password').eql('Password incorrect');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('Should not Login without email', () => {
      const user = {
        email: '',
        password: 'mypassword',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('Email field is required');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('Should not Login with invalid email', () => {
      const user = {
        email: 'testament,com',
        password: 'mypassword',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('email').eql('Email is invalid');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('Should not Login unregistered user', () => {
      const user = {
        email: 'testament@gmail.com',
        password: 'mypassword',
      };
      return chai.request(app)
        .post('/api/v1/auth/login')
        .send(user)
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('failed');
          res.body.should.have.property('errors').to.be.a('object');
          res.body.errors.should.have.property('email').eql('User not found');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
