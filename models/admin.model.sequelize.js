const { Sequelize, DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt'); 
const sequelize = require('../config/db_pqSQL');


class Admin extends Model {
  static async getAdmin() {
    return await Admin.findAll();
  }

 
  static async login(email, password) {
    const admin = await Admin.findOne({ where: { email } });

   
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return null;
    }

    return admin; 
  }
}

Admin.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100], 
      },
    },
  },
  {
    sequelize,
    modelName: 'Admin',
    tableName: 'admins', 
    timestamps: false, 
    hooks: {
      beforeCreate: async (admin) => {
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(admin.password, salt);
      },
    },
  }
);

module.exports = Admin;
