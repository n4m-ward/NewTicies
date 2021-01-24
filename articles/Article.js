const Sequelize = require('sequelize');
const connection = require('../databases/database');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title:{
        type:Sequelize.STRING,
        allownull:false
    },
    slug:{
        type:Sequelize.STRING,
        allownull:false
    },
    body:{
        type:Sequelize.TEXT,
        allownull:false
    }
});

Category.hasMany(Article);
Article.belongsTo(Category);
Article.sync({force:false});

module.exports = Article;
