import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import moment from 'moment';

import pool from '../helpers/dbConnection';

class User {
  constructor(user) {
    this.pool = pool;
    this.user = user;
  }

  /**
   * Sign Up user to the database
   * @method createUser
   * @desc: Creates a new user and return the user
   * */

  async createUser() {
    try {
      const hash = await bcrypt.hash(this.user.password, 10);
      const avatar = gravatar.url(this.user.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      const query = {
        text: `INSERT INTO users (
          name, email, hashed_password,
          phone_number, address, avatar, created_date, modified_date, role
          ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        values: [this.user.name, this.user.email, hash,
          this.user.phone, this.user.homeAddress,
          avatar, moment(new Date()), moment(new Date()), 'user'],
      };
      const result = await this.pool.query(query);
      if (!result.rows[0]) throw new Error();
      return result.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * Login user to the database
   * @method loginUser
   * @desc: Login a user and return the user informations
   * */
  async loginUser() {
    const query = {
      text: 'SELECT * FROM users WHERE email = $1',
      values: [this.user.email],
    };

    try {
      const result = await this.pool.query(query);
      const user = result.rows[0];
      if (!user) return ({ code: 1, id: null });
      const passwordMatch = await bcrypt.compare(this.user.password, user.hashed_password);
      if (passwordMatch) {
        return ({
          code: 2,
          id: user.user_id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone_number,
          address: user.address,
          role: user.role,
        });
      }
      return ({ code: 3, id: null });
    } catch (err) {
      return err;
    }
  }


  /**
   * Checks whether user email is already in the database
   * @method
   * @param  {string} input - object to store user details
   */
  async checkUserExistBefore(input) {
    this.user.email = input.email;
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE email = $1', [input.email]);
      if (result.rows[0]) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  }

  async findById(input) {
    try {
      const result = await this.pool.query('SELECT * FROM users WHERE user_id = $1',
        [input.id]);
      if (result.rows[0]) {
        return result.rows[0];
      }
      return false;
    } catch (err) {
      return err;
    }
  }
}

export default User;
