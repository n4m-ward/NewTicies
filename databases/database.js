const Sequelize = require('sequelize');

const connection = new Sequelize('heroku_4ae60710a5260b9','b7e5780dfac624','703aa011',{
    host:'us-cdbr-east-03.cleardb.com',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;
