require('dotenv').config();
const pg = require('pg');
const { Pool } = pg;

let awsPoolConfig = {
    user: process.env.DB_USER_AWS,
    password: process.env.DB_PASSWORD_AWS,
    host: process.env.DB_HOST_AWS,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE_AWS,
    ssl: { rejectUnauthorized: false }
};

const pool = new Pool(awsPoolConfig);

module.exports = pool;
