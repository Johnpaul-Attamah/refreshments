import moment from 'moment';
import pool from '../helpers/dbConnection';

class Order {
  constructor(order) {
    this.pool = pool;
    this.order = order;
  }

  async getAllOrders() {
    try {
      const query = {
        text: `SELECT orders.order_id, orders.address as delevery_Point, 
          orders.created_date, orders.modified_date, orders.status, 
          users.name as created_by, users.phone_number, productsorders.product_number, productsorders.name as ordered_item, productsorders.quantity, productsorders.sub_total
          from ((orders
          inner join users on orders.user_id = users.user_id)
          inner join productsorders on orders.order_id = productsorders.order_id)`,
      };
      const result = await this.pool.query(query);
      if (result.rows) {
        return result.rows;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async getOrderById(orderId) {
    try {
      const query = {
        text: `SELECT orders.order_id, orders.address as delevery_Point, 
          orders.created_date, orders.modified_date, orders.status, 
          users.name as created_by, users.phone_number, productsorders.product_number, productsorders.name as ordered_item, productsorders.quantity, productsorders.sub_total
          from ((orders
          inner join users on orders.user_id = users.user_id)
          inner join productsorders on orders.order_id = productsorders.order_id)
          where orders.order_id = $1 `,
        values: [orderId],
      };
      const result = await this.pool.query(query);
      if (result.rows) {
        return result.rows;
      }
      return false;
    } catch (error) {
      return error;
    }
  }


  async getOrdersByUserId(userId) {
    try {
      const query = {
        text: `SELECT orders.order_id, orders.address as delevery_Point, 
          orders.created_date, orders.modified_date, orders.status, 
          users.name as created_by, users.phone_number, productsorders.product_number, productsorders.name, productsorders.quantity, productsorders.sub_total
          from ((orders
          inner join users on orders.user_id = users.user_id)
          inner join productsorders on orders.order_id = productsorders.order_id)
          where orders.user_id = $1`,
        values: [userId],
      };
      const result = await this.pool.query(query);
      if (result.rows) {
        return result.rows;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async getMyOrderByUserId(userId, orderId) {
    try {
      const query = {
        text: `SELECT orders.order_id, orders.address as delevery_Point, 
          orders.created_date, orders.modified_date, orders.status, 
          users.name as created_by, users.phone_number, productsorders.product_number, productsorders.name, productsorders.quantity, productsorders.sub_total
          from ((orders
          inner join users on orders.user_id = users.user_id)
          inner join productsorders on orders.order_id = productsorders.order_id)
          where orders.user_id = $1 and orders.order_id = $2`,
        values: [userId, orderId],
      };
      const result = await this.pool.query(query);
      if (result.rows) {
        return result.rows;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async calculateTotal(orderId) {
    try {
      const result = await this.pool.query('SELECT sum(sub_total) FROM productsorders WHERE order_id = $1', [orderId]);
      if (result.rows) {
        return result.rows[0].sum;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async placeOrder(input, userId) {
    try {
      const query = {
        text: `INSERT INTO orders (user_id, address,
                created_date, modified_date)
              VALUES($1, $2, $3, $4) RETURNING *`,
        values: [userId, input.recievingAddress, moment(new Date()), moment(new Date())],
      };
      const newOrder = await this.pool.query(query);
      if (newOrder.rows[0]) {
        return newOrder.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async completeProductOrders(input, orderId, subTotal) {
    try {
      const query = {
        text: `INSERT INTO productsorders (order_id, product_number,
                name, quantity, sub_total)
              VALUES($1, $2, $3, $4, $5) RETURNING *`,
        values: [orderId, input.product_number, input.name, input.quantity, subTotal],
      };
      const result = await this.pool.query(query);
      if (result.rows[0]) {
        return result.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  // check if food is in the menu
  async peekMenu(product) {
    try {
      const result = await this.pool.query('SELECT product_number, price FROM products WHERE name = $1', [product.name]);
      if (result.rows) {
        return result.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async updateOrderStatus(status, orderId) {
    try {
      const result = await this.pool.query('UPDATE orders set status = $1, modified_date = $2 WHERE order_id = $3 RETURNING *', [status, moment(new Date()), orderId]);
      if (result.rows) {
        return result.rows[0];
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async getUserAddress(userId) {
    try {
      const result = await this.pool.query('SELECT address FROM users WHERE user_id = $1', [userId]);
      if (result.rows[0]) {
        return result.rows[0].address;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async updatedBy(adminId) {
    try {
      const result = await this.pool.query('SELECT name FROM users WHERE user_id = $1', [adminId]);
      if (result.rows[0]) {
        return result.rows[0].name;
      }
      return false;
    } catch (error) {
      return error;
    }
  }
}

export default Order;
