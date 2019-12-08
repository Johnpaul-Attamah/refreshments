import pool from '../dbConnection';

export default class DropTablesSchema {
  /**
     * Database schemma.
     * @constructor
     *
     */

  constructor() {
    this.pool = pool;
    this.dropProductsOrdersTable = 'DROP TABLE IF EXISTS productsorders';
    this.dropOrdersTable = 'DROP TABLE IF EXISTS orders';
    this.dropProductsTable = 'DROP TABLE IF EXISTS products';
    this.dropUserTable = 'DROP TABLE IF EXISTS users';
  }

  /**
     * drops database tables.
     * @method
     *
     */

  async drop() {
    try {
      await this.pool.query(this.dropProductsOrdersTable);
      await this.pool.query(this.dropOrdersTable);
      await this.pool.query(this.dropProductsTable);
      await this.pool.query(this.dropUserTable);
      return await this.pool.end();
    } catch (err) {
      return err;
    }
  }
}

new DropTablesSchema().drop();
