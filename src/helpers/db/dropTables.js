import pool from '../dbConnection';

export default class DropTablesSchema {
  /**
     * Database schemma.
     * @constructor
     *
     */

  constructor() {
    this.pool = pool;
    this.dropUserTable = 'DROP TABLE IF EXISTS users';
  }

  /**
     * creates database tables.
     * @method
     *
     */

  async drop() {
    try {
      await this.pool.query(this.dropUserTable);
      return await this.pool.end();
    } catch (err) {
      return err;
    }
  }
}

new DropTablesSchema().drop();
