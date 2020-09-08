const Sequelize = require('sequelize');
const connection = require('../databases/database');

const User = connection.define('users',{
    login:{
        type:Sequelize.STRING,
        allownull:false
    },
    email:{
        type:Sequelize.STRING,
        allownull:false
    },
    password:{
        type:Sequelize.STRING,
        allownull:false
    },
    
});

User.sync({force:false})
module.exports = User;
