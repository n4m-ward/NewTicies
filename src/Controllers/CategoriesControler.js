const Category = require('../../categories/Category');
const slugify = require('slugify');
const Article = require("./articles/Article");

class CategoriesControler {
    async renderNewCategoriesPage(req, res) {
        const isUserLogged = req.session.user;
        const categories = await Category.findAll()

        return res.render(
            'admin/categories/new',
            {
                estaLogado: isUserLogged,
                categories
            }
        );
    }

    async renderAllCategoriesPage(req, res) {
        const isUserLogged = req.session.user;
        const categories = await Category.findAll()

        return res.render(
            'admin/categories/index',
            {
                categories,
                estaLogado: isUserLogged
            }
        )
    }

    async renderEditCategoriesPage(req, res) {
        try {
            const id = req.params.id;
            const isUserLogged = req.session.user;

            if (isNaN(id)) {
                return res.redirect('/admin/categories');
            }
            const category = await Category.findByPk(id)

            if (!category) {
                return res.redirect('/admin/categories');
            }

            return res.render(
                'admin/categories/edit',
                {
                    category,
                    estaLogado: isUserLogged
                }
            );
        } catch (err) {
            console.log(err)
            res.redirect('/admin/categories');
        }

    }

    async saveCategories(req, res) {
        const title = req.body.title;
        if (!title) {
            res.redirect('/admin/categories/new');
        }
        await Category.create({
            title: title,
            slug: slugify(title)
        })

        return res.redirect("/admin/categories");
    }

    async updateCategories(req, res) {
        const {id, title} = req.body;
        const slug = req.body.title;
        await Category.update(
            {
                title: title,
                slug: slug
            },
            {
                where: {
                    id: id
                }
            }
        )

        return res.redirect('/admin/categories');
    }

    async deleteCategories(req, res) {
        const id = req.body.id;

        if (!id || !isNaN(id)) {
            return res.redirect("/admin/categories");
        }
        await Category.destroy({
            where: {
                id: id
            }
        })

        return res.redirect("/admin/categories");
    }

    async renderPageCategoryBySlug(req, res) {
        try {
            const isUserLogged = req.session.user;
            const slug = req.params.slug;
            const category = await Category.findOne({
                where: {
                    slug: slug
                },
                include: [{model: Article}]
            })

            if (!category) {
                return res.redirect('/');
            }
            const categories = await Category.findAll()

            return res.render(
                'index',
                {
                    articles: category.articles,
                    categories: categories,
                    estaLogado: isUserLogged
                }
            )
        } catch (err) {
            console.log(err)
            res.redirect('/')
        }
    }
}

module.exports = new CategoriesControler();
