const User = require('./User');
const Category = require('../categories/Category');
const bcrypt = require('bcryptjs');

class UsersControler {
    logout(req, res) {
        req.session.user = undefined;
        res.redirect('/');
    }

    authenticateUser(req, res) {
        var login = req.body.login;
        var password = req.body.password;

        User.findOne({where:{ login:login }}).then(user => {
            if(user != undefined){
                var correct = bcrypt.compareSync(password,user.password);

                if(correct){
                    req.session.user = {
                        id: user.id,
                        login: user.login
                    }
                    res.redirect('/admin/articles')
                }else{
                    res.redirect('/login')
                }
            }else{
                res.redirect('/login')
            }
        })
    }

    renderPageListUsers(req, res) {
        var estaLogado = req.session.user;
        if(req.session.user == undefined){
            res.redirect('/')
        }
        Category.findAll().then(categories => {
            User.findAll().then(users => {
                res.render("admin/users/list",{categories:categories,users:users,estaLogado:estaLogado})
            })
        })

    }

    renderPageCreateUsers(req,res) {
        Category.findAll().then(categories =>{
            res.render('admin/users/create',{categories:categories});
        })
    }

    createUser(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var login = req.body.Login;

        User.findOne({where:{email: email}}).then(user =>{
            if(user == undefined){

                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);

                User.create({
                    email: email,
                    login:login,
                    password: hash
                }).then(()=>{
                    res.redirect('/');
                }).catch((err)=>{
                    res.redirect('/');
                })
            }
            else{
                res.redirect('/admin/users/create')
            }
        })
    }

    deleteUser(req, res) {
        var id = req.body.id;
        if(id != undefined){
            if(!isNaN(id)){

                User.destroy({
                    where:{
                        id: id
                    }
                }).then(() => {
                    res.redirect("/admin/users");
                })

            }
            else{
                res.redirect("/admin/users");
            }
        }
        else{
            res.redirect("/admin/users");
        }
    }

    login(req, res) {
        Category.findAll().then(categories=>{

            res.render('admin/users/login',{categories:categories})
        })
    }
}











module.exports = new UsersControler();