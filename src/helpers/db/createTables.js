import pool from '../dbConnection';

export default class CreateTableSchema {
  /**
     * Database schemma.
     * @constructor
     *
     */

  constructor() {
    this.pool = pool;
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
        is_admin boolean DEFAULT false,
        is_super_admin boolean DEFAULT false
      )`;
  }

  /**
   * creates database tables.
   * @method
   *
   */
  async create() {
    try {
      await this.pool.query(this.createUsersTable);
      return await this.pool.end();
    } catch (err) {
      return err;
    }
  }
}

new CreateTableSchema().create();
