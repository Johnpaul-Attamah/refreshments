import moment from 'moment';
import pool from '../helpers/dbConnection';


class Product {
  constructor(product) {
    this.pool = pool;
    this.product = product;
  }

  async createProduct(adminId) {
    const query = {
      text: `INSERT INTO products (
                user_id, name, product_img, 
                quantity, price, description, created_date, modified_date
            ) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      values: [adminId, this.product.name, this.product.productImg,
        this.product.quantity, this.product.price, this.product.description,
        moment(new Date()), moment(new Date())],
    };
    try {
      const result = await this.pool.query(query);
      if (!result.rows[0]) throw new Error();
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  async createdBy(adminId) {
    try {
      const result = await this.pool.query('SELECT name FROM users WHERE user_id = $1', [adminId]);
      if (result) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async getMenu() {
    try {
      const result = await this.pool.query('SELECT * FROM products');
      if (result) {
        return result.rows;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async getMenuByProductNumber(productNumber) {
    try {
      const result = await this.pool.query(`
      SELECT * FROM products WHERE product_number = $1`, [productNumber]);
      if (result) {
        return result.rows;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async getMenuByAdminId(adminId) {
    try {
      const result = await this.pool.query(`
          SELECT * FROM products WHERE user_id = $1`, [adminId]);
      if (result) {
        return result.rows;
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async editMenu(input, productNumber) {
    const query = {
      text: `UPDATE products 
          SET name = $1, product_img = $2, quantity = $3, 
          price = $4, description = $5, modified_date = $6
          WHERE product_number = $7 returning *`,
      values: [input.name, input.productImg, input.quantity, input.price,
        input.description, moment(new Date()), productNumber],
    };
    try {
      const updatedProduct = await this.pool.query(query);
      if (updatedProduct) {
        return updatedProduct.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async deleteProduct(adminId, productNumber) {
    try {
      const deleteMenu = await this.pool.query(`
         DELETE FROM products WHERE product_number = $1`, [productNumber]);
      if (deleteMenu) {
        return {
          value: true,
          deletedBy: adminId,
        };
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  async checkItemExistBefore(input) {
    this.product.name = input.name;
    try {
      const result = await this.pool.query('SELECT * FROM products WHERE name = $1', [input.name]);
      if (result.rows[0]) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  }
}

export default Product;
