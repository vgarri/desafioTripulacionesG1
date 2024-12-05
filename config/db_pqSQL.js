require('dotenv').config();
const pg = require('pg');
const { Pool } = pg;
//local
// let localPoolConfig = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     database: process.env.DB_DATABASE,
// };
let localPoolConfig = {
    user: process.env.DB_USER_RENDER,
    password: process.env.DB_PASSWORD_RENDER,
    host: process.env.DB_HOST_RENDER,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE_RENDER,
    ssl: true
};

const pool = new Pool(localPoolConfig);

module.exports = pool;