const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('product',{
  productId: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  productName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  productPrice: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  productDescription: {
    type: Sequelize.STRING,
    allowNull: false
  },
  productUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Product;