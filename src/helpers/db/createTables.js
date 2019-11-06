import pool from '../dbConnection';

export default class CreateTableSchema {
  /**
     * Database schemma.
     * @constructor
     *
     */

  constructor() {
    this.pool = pool;
    this.createUserRoles = `CREATE TYPE roles AS ENUM(
      'superAdmin', 
      'admin', 
      'user')`;
    this.createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        hashed_password varchar(255) NOT NULL,
        phone_number varchar(255) NOT NULL,
        address varchar(255) NOT NULL,
        avatar varchar(255) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        role roles
      )`;
  }

  /**
   * creates database tables.
   * @method
   *
   */
  async create() {
    try {
      await this.pool.query(this.createUserRoles);
      await this.pool.query(this.createUsersTable);
      return this.pool.end;
    } catch (err) {
      return err;
    }
  }
}

new CreateTableSchema().create();
