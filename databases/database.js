const Sequelize = require('sequelize');

const connection = new Sequelize('heroku_b7e8ee8c9f3fe1b','b662165df25638','37406118',{
    host:'us-cdbr-east-03.cleardb.com:3307',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;
