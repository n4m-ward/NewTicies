const Sequelize = require('sequelize');

const connection = new Sequelize('gabrielpkm','root000','sfdabc12300',{
    host:'mysql669.umbler.com',
    dialect:'mysql',
    timezone: "-03:00"
});

module.exports = connection;
