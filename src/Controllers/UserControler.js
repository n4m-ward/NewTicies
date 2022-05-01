const User = require('../../users/User');
const Category = require('../../categories/Category');
const bcrypt = require('bcryptjs');

class UserControler {
    logout(req, res) {
        req.session.user = undefined;
        res.redirect('/');
    }

    async authenticateUser(req, res) {
        const {login, password} = req.body;

        try {
            const user = await User.findOne({
                where: {login}
            })
            if (!user) {
                res.redirect('/login')
            }

            const isUserLogged = bcrypt.compareSync(password, user.password);
            if (!isUserLogged) {
                res.redirect('/login')
            }

            req.session.user = {
                id: user.id,
                login: user.login
            }
            res.redirect('/admin/articles')
        } catch (err) {
            console.log(err)
            res.redirect('/login')
        }
    }

    async renderPageListUsers(req, res) {
        const isUserLogged = req.session.user;
        if (!isUserLogged) {
            res.redirect('/')
        }
        const categories = await Category.findAll()
        const users = await User.findAll()

        res.render(
            "admin/users/list",
            {
                categories,
                users,
                estaLogado: isUserLogged
            }
        )
    }

    async renderPageCreateUsers(req, res) {
        const categories = await Category.findAll()

        res.render(
            'admin/users/create',
            {
                categories: categories
            }
        );
    }

    async createUser(req, res) {
        try {
            const {email, password, login} = req.body;
            const user = await User.findOne({where: {email: email}})
            if (user) {
                res.redirect('/admin/users/create')
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await User.create({
                email,
                login,
                password: hash
            })

            res.redirect('/');
        } catch (err) {
            res.redirect('/');
        }
    }

    async deleteUser(req, res) {
        const id = req.body.id;
        if (!id) {
            res.redirect("/admin/users");
        }
        if (isNaN(id)) {
            res.redirect("/admin/users");
        }
        await User.destroy({
            where: {
                id: id
            }
        })

        res.redirect("/admin/users");
    }

    async renderLoginPage(req, res) {
        const categories = await Category.findAll()

        res.render('admin/users/login', {categories: categories})
    }
}

module.exports = new UserControler();
