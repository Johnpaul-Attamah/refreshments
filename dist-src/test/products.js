"use strict";

var _chai = _interopRequireDefault(require("chai"));

var _chaiHttp = _interopRequireDefault(require("chai-http"));

var _index = _interopRequireDefault(require("../index"));

var _dbConnection = _interopRequireDefault(require("../helpers/dbConnection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai.default.use(_chaiHttp.default);

_chai.default.should();

let token1;
let token2;
let token3;
describe('MENU', () => {
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
  before(done => {
    _dbConnection.default.query('DELETE from products where name = \'pop corn\'').then(() => {
      done();
    }).catch(() => done());
  });
  describe('POST /menu', () => {
    it('should generate token', done => {
      token1.should.be.a('string');
      token2.should.be.a('string');
      token3.should.be.a('string');
      done();
    });
    it('should add food to menu', () => {
      const product = {
        token: token1,
        name: 'pop corn',
        productImg: 'https://www.cloudinary.com/pop-corn/user2#',
        quantity: 14,
        price: 99.99,
        description: 'Greats pop corn best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('product added successfully');
        res.body.should.have.property('newProduct').to.be.a('object');
        res.body.should.have.property('createdBy').to.be.a('object');
        res.body.createdBy.should.have.property('name').eql('administrator Test');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product name is empty', () => {
      const product = {
        token: token1,
        name: '',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 100.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('name').eql('Product name field is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product image is empty', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: '',
        quantity: 14,
        price: 100.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('productImg').eql('Product image is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product quantity is empty', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: '',
        price: 100.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('quantity').eql('Product quantity is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product price is empty', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: '',
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('price').eql('Product Price field is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product description is empty', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 450.98,
        description: ''
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('description').eql('Product Description is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if all field is empty', () => {
      const product = {
        token: token1,
        name: '',
        productImg: '',
        quantity: '',
        price: '',
        description: ''
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('name').eql('Product name field is required');
        res.body.errors.should.have.property('productImg').eql('Product image is required');
        res.body.errors.should.have.property('quantity').eql('Product quantity is required');
        res.body.errors.should.have.property('price').eql('Product Price field is required');
        res.body.errors.should.have.property('description').eql('Product Description is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if more than one fields are empty', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: '',
        quantity: 14,
        price: '',
        description: ''
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('productImg').eql('Product image is required');
        res.body.errors.should.have.property('price').eql('Product Price field is required');
        res.body.errors.should.have.property('description').eql('Product Description is required');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if name length < 2 or > 30', () => {
      const product = {
        token: token1,
        name: 'donutsghytfdreujihytfrghnbvfrtyuiiiyhvvffcvhjkkk',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 600.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('name').eql('Product name must be between 2 and 30 characters');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product image is invalid', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'hu#',
        quantity: 14,
        price: 900.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('productImg').eql('Not a valid product url');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product descriptions is few words', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: '',
        description: 'Greats do'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('description').eql('Descriptions must be more than 20 characters');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product quantity is not a number', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 'eto',
        price: 200.25,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('quantity').eql('Quantity must be a number');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product quantity is not an integer', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 4.89,
        price: 200.25,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('quantity').eql('Quantity must be an integer');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product price is not a number', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 4,
        price: 'yeah',
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('price').eql('Price must be a floating point number');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if product price is not float', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 'eto',
        price: 200,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('price').eql('Price must be a floating point number');
      }).catch(err => {
        throw err;
      });
    });
    it('should not add same food to menu more than once', () => {
      const product = {
        token: token1,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 99.99,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(422);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('failed');
        res.body.should.have.property('errors').to.be.a('object');
        res.body.errors.should.have.property('name').eql('Product name already exists');
        res.body.should.have.property('name').eql('donuts');
      }).catch(err => {
        throw err;
      });
    });
    it('should throw error if user is not an Administrator', () => {
      const product = {
        token: token3,
        name: 'donuts',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 100.00,
        description: 'Greats donut best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token3).then(res => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('Access Denied');
      }).catch(err => {
        throw err;
      });
    });
  });
  let productId;
  describe('GET /menu', () => {
    it('should get product menu', () => {
      return _chai.default.request(_index.default).get('/api/v1/menu').then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('menu').to.be.a('array');
        productId = res.body.menu[0].product_number;
      }).catch(err => {
        throw err;
      });
    });
    it('should get product by product number', () => {
      return _chai.default.request(_index.default).get(`/api/v1/menu/${productId}`).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('product Fetched successfully!');
        res.body.should.have.property('product').to.be.a('array');
      }).catch(err => {
        throw err;
      });
    });
  });
  describe('PUT /menu/products/:productId', () => {
    it('should create new product to be deleted', () => {
      const product = {
        token: token1,
        name: 'akara Test',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 49.99,
        description: 'Greats akara best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).post('/api/v1/menu').send(product).set('Authorization', token1).then(res => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('product added successfully');
        res.body.should.have.property('newProduct').to.be.a('object');
        res.body.should.have.property('createdBy').to.be.a('object');
        res.body.createdBy.should.have.property('name').eql('administrator Test');
        productId = res.body.newProduct.product_number;
      }).catch(err => {
        throw err;
      });
    });
    it('should update product details', () => {
      const product = {
        token: token1,
        name: 'akara Test updated',
        productImg: 'https://www.cloudinary.com/donuts/user2#',
        quantity: 14,
        price: 50.12,
        description: 'Greats akara best served when hot, we have it boku'
      };
      return _chai.default.request(_index.default).put(`/api/v1/menu/products/${productId}`).send(product).set('Authorization', token1).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('product updated successfully');
        res.body.should.have.property('product').to.be.a('object');
        res.body.should.have.property('updatedBy').to.be.a('object');
        res.body.updatedBy.should.have.property('name').eql('administrator Test');
      }).catch(err => {
        throw err;
      });
    });
  });
  describe('DELETE /menu/products/:productId', () => {
    it('should delete a product', () => {
      return _chai.default.request(_index.default).delete(`/api/v1/menu/products/${productId}`).set('Authorization', token1).then(res => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('status').eql('success');
        res.body.should.have.property('message').eql('product deleted successfully');
        res.body.should.have.property('deletedBy').to.be.a('object');
        res.body.deletedBy.should.have.property('name').eql('administrator Test');
      }).catch(err => {
        throw err;
      });
    });
  });
});