const Sequelize = require('sequelize');

const connection = new Sequelize('main','b662165df25638','37406118',{
    host:'us-cdbr-east-03.cleardb.com',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;
