const User = require('../../users/User');
const Category = require('../../categories/Category');
const bcrypt = require('bcryptjs');

class UserControler {
    logout(req, res) {
        req.session.user = undefined;

        return res.redirect('/');
    }

    async authenticateUser(req, res) {
        const {login, password} = req.body;

        try {
            const user = await User.findOne({
                where: {login}
            })

            if (!user) {
                return res.redirect('/login')
            }

            const isUserLogged = bcrypt.compareSync(password, user.password);

            if (!isUserLogged) {
                return res.redirect('/login')
            }

            req.session.user = {
                id: user.id,
                login: user.login
            }

            return res.redirect('/admin/articles')
        } catch (err) {
            console.log(err)
            return res.redirect('/login')
        }
    }

    async renderPageListUsers(req, res) {
        const isUserLogged = req.session.user;

        if (!isUserLogged) {
            return res.redirect('/')
        }
        const categories = await Category.findAll()
        const users = await User.findAll()

        return res.render(
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

        return res.render(
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
                return res.redirect('/admin/users/create')
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);
            await User.create({
                email,
                login,
                password: hash
            })

            return res.redirect('/');
        } catch (err) {
            return res.redirect('/');
        }
    }

    async deleteUser(req, res) {
        const id = req.body.id;

        if (!id || isNaN(id)) {
            return res.redirect("/admin/users");
        }

        await User.destroy({
            where: {
                id: id
            }
        })

        return res.redirect("/admin/users");
    }

    async renderLoginPage(req, res) {
        const categories = await Category.findAll()

        return res.render('admin/users/login', {categories: categories})
    }
}

module.exports = new UserControler();
