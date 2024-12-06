require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_DATABASE_AWS, 
  process.env.DB_USER_AWS,   
  String(process.env.DB_PASSWORD_AWS),
  {
    host: process.env.DB_HOST_AWS, 
    port: process.env.DB_PORT,        
    dialect: 'postgres',             
    dialectOptions: {
      ssl: false
    },
    logging: false, 
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión con la base de datos establecida correctamente.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }
})();

module.exports = sequelize;




// require('dotenv').config();
// const pg = require('pg');
// const { Pool } = pg;
// //local
// // let localPoolConfig = {
// //     user: process.env.DB_USER,
// //     password: process.env.DB_PASSWORD,
// //     host: process.env.DB_HOST,
// //     port: process.env.DB_PORT,
// //     database: process.env.DB_DATABASE,
// // };
// let localPoolConfig = {
//     user: process.env.DB_USER_RENDER,
//     password: process.env.DB_PASSWORD_RENDER,
//     host: process.env.DB_HOST_RENDER,
//     port: process.env.DB_PORT,
//     database: process.env.DB_DATABASE_RENDER,
//     ssl: true
// };

// const pool = new Pool(localPoolConfig);

// module.exports = pool;