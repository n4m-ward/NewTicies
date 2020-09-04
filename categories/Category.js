const Sequelize = require('sequelize');
const connection = require('../databases/database');

const Category = connection.define('categorias',{
    title:{
        type:Sequelize.STRING,
        allownull:false
    },
    slug:{
        type:Sequelize.STRING,
        allownull:false
    }
});


module.exports = Category;
