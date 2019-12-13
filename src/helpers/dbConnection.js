import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';

let dbConnection;
if (env === 'test') {
  dbConnection = process.env.TEST_DATABASE_URL;
} else {
  dbConnection = process.env.DATABASE_URL;
}


/**
 * function pool returns a connection to database
 * @param  {string} connectionString - database connection url
 */
const pool = new Pool({
  connectionString: dbConnection,
});

export default pool;
