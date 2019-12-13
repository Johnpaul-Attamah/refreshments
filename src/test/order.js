import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import Pool from '../helpers/dbConnection';

chai.use(chaiHttp);
chai.should();
let token1;
let token2;
let token3;
let userId;
describe('POST /Orders', () => {
  before((done) => {
    const user1 = {
      email: 'superadmin@gmail.com',
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
      email: 'admin@gmail.com',
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
  before((done) => {
    const user3 = {
      email: 'test@gmail.com',
      password: 'mypassword',
    };
    chai.request(app)
      .post('/api/v1/auth/login')
      .send(user3)
      .then((res) => {
        token3 = res.body.token;
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  before((done) => {
    Pool.query(('DELETE from products where name = \'cake Test\''))
      .then(() => {
        done();
      }).catch(() => done());
  });
  before((done) => {
    Pool.query(('DELETE from products where name = \'chin chin Test\''))
      .then(() => {
        done();
      }).catch(() => done());
  });
  before((done) => {
    Pool.query(('DELETE from products where name = \'donuts\''))
      .then(() => {
        done();
      }).catch(() => done());
  });
  before((done) => {
    const product = {
      token: token1,
      name: 'cake Test',
      productImg: 'https://www.cloudinary.com/donuts/user2#',
      quantity: 34,
      price: 50.12,
      description: 'Greats cakes best served minutes after roductionp, we have it boku',
    };
    chai.request(app)
      .post('/api/v1/menu')
      .send(product)
      .set('Authorization', token1)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  before((done) => {
    const product = {
      token: token1,
      name: 'chin chin Test',
      productImg: 'https://www.cloudinary.com/donuts/user2#',
      quantity: 24,
      price: 48.98,
      description: 'Greats chin chin best served when hot, we have it boku',
    };
    chai.request(app)
      .post('/api/v1/menu')
      .send(product)
      .set('Authorization', token1)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  before((done) => {
    const product = {
      token: token1,
      name: 'donuts',
      productImg: 'https://www.cloudinary.com/donuts/user2#',
      quantity: 14,
      price: 99.99,
      description: 'Greats donut best served when hot, we have it boku',
    };
    chai.request(app)
      .post('/api/v1/menu')
      .send(product)
      .set('Authorization', token1)
      .then((res) => {
        res.should.have.status(201);
        res.body.should.be.a('object');
        done();
      })
      .catch((err) => {
        throw err;
      });
  });
  describe('POST /Order', () => {
    it('should generate token', (done) => {
      token1.should.be.a('string');
      token2.should.be.a('string');
      done();
    });
    it('should order for one or more items', () => {
      const order = {
        token: token3,
        recievingAddress: 'Nguru Nsukka',
        items: [
          {
            name: 'chin chin Test',
            quantity: 2,
          },
          {
            name: 'cake Test',
            quantity: 1,
          },
          {
            name: 'donuts',
            quantity: 2,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('message').eql('order Placed successfully!');
          res.body.should.have.property('newOrders').to.be.a('object');
          res.body.newOrders.should.have.property('order_id').to.be.a('string');
          res.body.newOrders.should.have.property('user_id').to.be.a('string');
          res.body.newOrders.should.have.property('address').to.be.a('string');
          res.body.newOrders.should.have.property('status').eql('New');
          res.body.should.have.property('productDetails').to.be.a('array');
          res.body.should.have.property('quantitiesRemaining').to.be.a('array');
          userId = res.body.newOrders.user_id;
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should post order with user address if reciever\'s  address was not provided', () => {
      const order = {
        token: token3,
        recievingAddress: 'Nguru Nsukka',
        items: [
          {
            name: 'chin chin Test',
            quantity: 2,
          },
          {
            name: 'cake Test',
            quantity: 1,
          },
          {
            name: 'donuts',
            quantity: 2,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success');
          res.body.should.have.property('message').eql('order Placed successfully!');
          res.body.should.have.property('newOrders').to.be.a('object');
          res.body.newOrders.should.have.property('order_id').to.be.a('string');
          res.body.newOrders.should.have.property('user_id').to.be.a('string');
          res.body.newOrders.should.have.property('address').to.be.a('string');
          res.body.newOrders.should.have.property('status').eql('New');
          res.body.should.have.property('productDetails').to.be.a('array');
          res.body.should.have.property('quantitiesRemaining').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not post if at least one item quantity is larger than the quantity on the menu', () => {
      const order = {
        token: token3,
        items: [
          {
            name: 'chin chin Test',
            quantity: 5,
          },
          {
            name: 'cake Test',
            quantity: 8,
          },
          {
            name: 'donuts',
            quantity: 84,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .eql('not enough quantity for selected product(s)');
          res.body.should.have.property('item').eql('donuts');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not post if at least one item is not in the menu', () => {
      const order = {
        token: token3,
        items: [
          {
            name: 'chin chin Test',
            quantity: 3,
          },
          {
            name: 'moi moi Test',
            quantity: 2,
          },
          {
            name: 'donuts',
            quantity: 1,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('product not found in the menu');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not post if at least one item quantity is zero', () => {
      const order = {
        token: token3,
        items: [
          {
            name: 'chin chin Test',
            quantity: '',
          },
          {
            name: 'moi moi Test',
            quantity: 2,
          },
          {
            name: 'donuts',
            quantity: 1,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('quantity').eql('Product quantity is required');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not post if at least one item name is empty', () => {
      const order = {
        token: token3,
        items: [
          {
            name: '',
            quantity: 4,
          },
          {
            name: 'moi moi Test',
            quantity: 2,
          },
          {
            name: 'donuts',
            quantity: 1,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(400);
          res.body.should.be.a('object');
          res.body.should.have.property('name').eql('Product name field is required');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should deny access if user is not logged in', () => {
      const order = {
        items: [
          {
            name: 'chin chin Test',
            quantity: 4,
          },
          {
            name: 'cake Test',
            quantity: 2,
          },
          {
            name: 'donuts',
            quantity: 1,
          },
        ],
      };
      return chai.request(app)
        .post('/api/v1/orders')
        .send(order)
        .then((res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('No Token Passed');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  let orderId;
  describe('GET /orders', () => {
    it('should get all orders', () => {
      return chai.request(app)
        .get('/api/v1/orders')
        .send()
        .set('Authorization', token1)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('orders fetched successfully!');
          res.body.should.have.property('orders').to.be.a('array');
          orderId = res.body.orders[0].order_id;
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should get order by orderId', () => {
      return chai.request(app)
        .get(`/api/v1/orders/${orderId}`)
        .send()
        .set('Authorization', token1)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('order fetched successfully!');
          res.body.should.have.property('order').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not get all orders if user is not administrators', () => {
      return chai.request(app)
        .get('/api/v1/orders')
        .send()
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Access Denied');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not get order by Id if user is not administrators', () => {
      return chai.request(app)
        .get(`/api/v1/orders/${orderId}`)
        .send()
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Access Denied');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should get all orders of a logged in user', () => {
      return chai.request(app)
        .get(`/api/v1/orders/${userId}/my_orders`)
        .send()
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('orders fetched successfully!');
          res.body.should.have.property('userOrders').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should get login user order by id', () => {
      return chai.request(app)
        .get(`/api/v1/orders/${userId}/my_orders/${orderId}`)
        .send()
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('orders fetched successfully!');
          res.body.should.have.property('userOrder').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
  describe('PUT /orders/:orderId', () => {
    it('should update order status', () => {
      const order = {
        status: 'Processing',
      };
      return chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send(order)
        .set('Authorization', token1)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message').eql('status updated successfully');
          res.body.should.have.property('statusUpdate').to.be.a('object');
          res.body.should.have.property('updatedBy').to.be.a('string');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not update order status if status message do not match any of the given status messages', () => {
      const order = {
        status: 'Creative',
      };
      return chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send(order)
        .set('Authorization', token1)
        .then((res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('status').eql('Success but Failed on Update message');
          res.body.should.have.property('message').eql('message should be any of ');
          res.body.should.have.property('adminStatus').to.be.a('array');
        })
        .catch((err) => {
          throw err;
        });
    });
    it('should not update status if user is not administrator', () => {
      const order = {
        status: 'Creative',
      };
      return chai.request(app)
        .put(`/api/v1/orders/${orderId}`)
        .send(order)
        .set('Authorization', token3)
        .then((res) => {
          res.should.have.status(403);
          res.body.should.be.a('object');
          res.body.should.have.property('message').eql('Access denied.');
        })
        .catch((err) => {
          throw err;
        });
    });
  });
});
