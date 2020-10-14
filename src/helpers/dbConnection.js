import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let dbConnection;

if (process.env.NODE_ENV === 'production') {
  dbConnection = process.env.PROD_DB_URI;
}

if (process.env.NODE_ENV === 'test') {
  dbConnection = process.env.TEST_DB_URI;
}

if (process.env.NODE_ENV === 'development') {
  dbConnection = process.env.DEV_DB_URI;
}

/**
 * function pool returns a connection to database
 * @param  {string} connectionString - database connection url
 */
const pool = new Pool({
  connectionString: dbConnection,
});

export default pool;
