"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

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


const pool = new _pg.Pool({
  connectionString: dbConnection
});
var _default = pool;
exports.default = _default;