const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete','root','asdf',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;