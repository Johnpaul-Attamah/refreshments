import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const dbConnection = (process.env.NODE_ENV === 'test') ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

/**
 * function pool returns a connection to database
 * @param  {string} connectionString - database connection url
 */
const pool = new Pool({
  connectionString: dbConnection,
});

export default pool;
