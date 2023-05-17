// another database connector
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

// (npm config set strict-ssl false if u r getting [Error: self signed certificate])
export const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: true,
});

export default pool;
