const Sequelize = require('sequelize');

const connection = new Sequelize('epiz_27846111_teste','epiz_27846111','Gabriel@2020',{
    host:'sql305.epizy.com',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;
