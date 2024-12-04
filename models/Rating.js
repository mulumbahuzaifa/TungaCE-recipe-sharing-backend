const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Rating = sequelize.define('Rating', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  recipeId: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = Rating;