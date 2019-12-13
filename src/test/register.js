import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Pool from '../helpers/dbConnection';

chai.use(chaiHttp);
chai.should();


describe('API index page', () => {
  describe('GET /', () => {
    it('it should Show a welcome message', (done) => {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

describe('User Validation', () => {
  before((done) => {
    Pool.query(('DELETE from users where email = \'test@gmail.com\''))
      .then(() => {
        done();
      }).catch(() => done());
  });
  describe('POST /auth/signup', () => {
    it('Should signup user and return the user object', () => {
      const user = {
        name: 'Nelson Test',
        email: 'test@gmail.com',
        password: 'mypassword',
        password2: 'mypassword',
        homeAddress: 'onuiyi Nsukka',
        phone: '08034923465',
      };
      return chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('message').eql('Account Created Successfully');
          res.body.should.have.property('newUser').to.be.a('object');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('Validating User registration', () => {
    describe('Name Validation', () => {
      it('should check name field exist', () => {
        const user = {
          name: '',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Name field is required');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('should check name length (between 2 and 30 characters)', () => {
        const user = {
          name: 'T',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Name must be between 2 and 30 characters');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Email Validation', () => {
      it('should check email field exist', () => {
        const user = {
          name: 'Nelson Test',
          email: '',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
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
      it('should check valid email field', () => {
        const user = {
          name: 'Nelson Test',
          email: 'testgmail,com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
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
      it('should check user exist', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(422);
            res.body.should.be.a('object');
            res.body.should.have.property('status').eql('failed');
            res.body.should.have.property('errors');
            res.body.errors.should.be.a('object');
            res.body.errors.should.have.property('email').eql('Email already exists');
            res.body.should.have.property('email').eql('test@gmail.com');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Password Validation', () => {
      it('should check password fields exist', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: '',
          password2: 'mypassword',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('password').eql('Password field is required');
            res.body.should.have.property('password2').eql('Passwords must match');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Confirm password', () => {
      it('should check password2 field exist', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: '',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('password2').eql('Passwords must match');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('should check password match', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypass',
          homeAddress: 'onuiyi Nsukka',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('password2').eql('Passwords must match');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Home Address Validation', () => {
      it('should check Home Address field exist', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: '',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('address').eql('Address field is required');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('should check Address length', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onu',
          phone: '09034523487',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('address').eql('Address must be more than 10 characters');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Phone Number Validation', () => {
      it('should check if phone number field exist', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'Nkalagu Obukpa, Nsukka',
          phone: '',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('phone').eql('Mobile Number is required');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('should check valid Nigerian Phone number', () => {
        const user = {
          name: 'Nelson Test',
          email: 'test@gmail.com',
          password: 'mypassword',
          password2: 'mypassword',
          homeAddress: 'onuiyi umugworie, Onitsha',
          phone: '560345',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('phone').eql('Mobile number too short');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    describe('Combined fields Validation', () => {
      it('should check if all fields exist', () => {
        const user = {
          name: '',
          email: '',
          password: '',
          password2: '',
          homeAddress: '',
          phone: '',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Name field is required');
            res.body.should.have.property('password').eql('Password field is required');
            res.body.should.have.property('phone').eql('Mobile Number is required');
            res.body.should.have.property('address').eql('Address field is required');
            res.body.should.have.property('email').eql('Email is invalid');
            res.body.should.have.property('password2').eql('Confirm password field is required');
          })
          .catch((err) => {
            throw err;
          });
      });
      it('should check combined validations', () => {
        const user = {
          name: 'D',
          email: 'testgmail,com',
          password: 'mypassword',
          password2: 'mypa',
          homeAddress: 'onuiyi Nsukka',
          phone: '890345',
        };
        return chai.request(app)
          .post('/api/v1/auth/register')
          .send(user)
          .then((res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
            res.body.should.have.property('name').eql('Name must be between 2 and 30 characters');
            res.body.should.have.property('phone').eql('Mobile number too short');
            res.body.should.have.property('email').eql('Email is invalid');
            res.body.should.have.property('password2').eql('Passwords must match');
          })
          .catch((err) => {
            throw err;
          });
      });
    });
    
  });
  
});
