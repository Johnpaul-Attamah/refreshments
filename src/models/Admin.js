import moment from 'moment';
import User from './User';
import pool from '../helpers/dbConnection';


class Admin extends User {

  /**
   * Database schemma.
   * @constructor,
   * @desc: queries database for Admin users
   */
  constructor(user) {
    super(user);
    this.pool = pool;
  }

  /**
   * Database schemma.
   * @method,
   * @desc: get user by id
   */
  async getUserById(userId) {
    // eslint-disable-next-line no-useless-catch
    try {
      const user = await this.pool.query('SELECT * FROM users WHERE user_id = $1',
        [userId]);
      if (user.rows[0]) {
        return user.rows[0];
      }
      return false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Database schemma.
   * @method,
   * @desc: get all users
   */
  async getUsers() {
    try {
      const users = await this.pool.query('SELECT * FROM users');
      if (users) {
        return users.rows;
      }
      return false;
    } catch (error) {
      return error;
    }
  }

  /**
   * Database schemma.
   * @method,
   * @desc: create admin
   */
  async createAdmin(userId) {
    const query = {
      text: `UPDATE users 
                SET role = $1, modified_date = $2
                WHERE user_id = $3 RETURNING *`,
      values: ['admin', moment(new Date()), userId],
    };
    try {
      const newAdmin = await this.pool.query(query);
      if (!newAdmin) {
        return false;
      }
      return newAdmin.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * Database schemma.
   * @method,
   * @desc: remove admin privileges
   */
  async removeAdminRole(userId) {
    const query = {
      text: `UPDATE users 
                SET role = $1, modified_date = $2
                WHERE user_id = $3 RETURNING *`,
      values: ['user', moment(new Date()), userId],
    };
    try {
      const returnedUser = await this.pool.query(query);
      if (!returnedUser.rows) {
        return false;
      }
      return returnedUser.rows[0];
    } catch (error) {
      return error;
    }
  }

  /**
   * Database schemma.
   * @method,
   * @desc: delete a user from database
   */
  async removeUser(userId) {
    const query = {
      text: 'DELETE FROM users WHERE user_id = $1 RETURNING *',
      values: [userId],
    };
    try {
      const deletedUser = await this.pool.query(query);
      if (!deletedUser) {
        return false;
      }
      return true;
    } catch (error) {
      return error;
    }
  }
}

export default Admin;
