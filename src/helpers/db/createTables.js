import pool from '../dbConnection';

export default class CreateTableSchema {
  /**
     * Database schemma.
     * @constructor,
     * @desc: Create database tables at once
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
    this.createProductsTable = `CREATE TABLE IF NOT EXISTS products(
        product_number uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid REFERENCES users(user_id),
        name varchar(255) NOT NULL,
        product_img text NOT Null,
        quantity integer NOT NULL,
        price float NOT NULL,
        description text NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;
    this.createOrdersTable = `CREATE TABLE IF NOT EXISTS orders(
      order_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
      address varchar(255),
      created_date TIMESTAMP,
      modified_date TIMESTAMP,
      status varchar(255) DEFAULT 'New'  
    )`;
    this.createProductsOrdersTable = `CREATE TABLE IF NOT EXISTS productsorders(
      order_id uuid REFERENCES orders(order_id) ON DELETE CASCADE,
      product_number uuid REFERENCES products(product_number) NOT NULL,
      name varchar(255) NOT NULL,
      quantity integer NOT NULL,
      sub_total float NOT NULL,
      CONSTRAINT Pk_ProductsOrders PRIMARY KEY(order_id, product_number)
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
      await this.pool.query(this.createProductsTable);
      await this.pool.query(this.createOrdersTable);
      await this.pool.query(this.createProductsOrdersTable);
      return this.pool.end;
    } catch (err) {
      return err;
    }
  }
}

new CreateTableSchema().create();
