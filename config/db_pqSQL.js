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
    console.log('');
  } catch (error) {
    console.error('', error.message);
  }
})();

module.exports = sequelize;

