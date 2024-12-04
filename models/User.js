const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Viewer',
  },
  resetToken: { 
    type: DataTypes.STRING,
    allowNull: true, // Allow null since it won't always be set
  },
  resetTokenExpires: { // New field for reset token expiration
    type: DataTypes.DATE,
    allowNull: true, // Allow null since it won't always be set
  },
});

module.exports = User;