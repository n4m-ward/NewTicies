const Category = require('../../categories/Category');
const Article = require('../../articles/Article');
const slugify = require('slugify');

class ArticlesControler {
    async renderPageListArticles(req, res) {
        const isUserLogged = req.session.user;
        const categories = await Category.findAll()
        const articles = await Article.findAll({
            include: [{ model: Category }]
        })

        return res.render(
            "admin/articles/index",
            {
                articles: articles,
                estaLogado: isUserLogged,
                categories: categories
            }
        )
    }

    async renderPageCreateArticles(req, res) {
        const isUserLogged = req.session.user;
        const categories = await Category.findAll()

        return res.render(
            '../views/admin/articles/new',
            {
                categories,
                estaLogado: isUserLogged
            }
        );
    }

    async createArticle(req, res) {
        const {title, body, category} = req.body;
        await Article.create({
            title: title,
            slug: slugify(title),
            body: body,
            categoriaId: category
        })

        return res.redirect('/admin/articles');
    }

    async deleteArticle(req, res) {
        const id = req.body.id;

        if (!id || isNaN(id)) {
            return res.redirect("/admin/articles");
        }

        await Article.destroy({
            where: {
                id: id
            }
        })

        return res.redirect("/admin/articles");
    }

    async renderPageEditArticle(req, res) {
        try {
            const id = req.params.id;
            const isUsserLogged = req.session.user;
            const article = await Article.findByPk(id)

            if (!article) {
                return res.redirect('/');
            }
            const categories = await Category.findAll()

            return res.render(
                'admin/articles/edit',
                {
                    categories: categories,
                    article: article,
                    estaLogado: isUsserLogged
                }
            );
        } catch (err) {
            console.log(err)
            return res.redirect('/admin/categories');
        }
    }

    async editArticle(req, res) {
        try {
            const {id, title, body, category} = req.body;
            await Article.update(
                {
                    title: title,
                    body: body,
                    categoriaId: category,
                    slug: slugify(title)
                },
                {
                    where: {
                        id: id
                    }
                }
            )

            return res.redirect('/admin/articles');
        } catch (err) {
            return res.redirect('/admin/articles')
        }
    }

    async listArticleByPage(req, res) {
        const isUserLogged = req.session.user;
        const page = req.params.num;
        let offset = this.getOffset(req);
        const articles = await Article.findAndCountAll({
            limit: 6,
            offset: offset,
            order: [
                ['id', 'DESC']
            ],
        })
        let ableToGoNextPage = offset + 6 < articles.count;
        const categories = await Category.findAll()
        const result = {
            page: parseInt(page),
            next: ableToGoNextPage,
            articles: articles
        }

        return res.render(
            'admin/articles/page',
            {
                result,
                categories,
                estaLogado: isUserLogged
            }
        )
    }

    getOffset(req) {
        const page = req.params.num;

        return parseInt(page) * 6;
    }

    async renderPageArticleBySlug(req, res) {
        try {
            const isUserLogged = req.session.user;
            const slug = req.params.slug;
            const article = await Article.findOne({
                where: {
                    slug
                },
                include: [{ model: Category }]
            })
            if (!article) {
                return res.redirect('/');
            }
            const categories = Category.findAll()

            return res.render('article', {
                article,
                categories,
                estaLogado: isUserLogged
            })
        } catch (err) {
            console.log(err)
            return res.redirect('/');
        }
    }

    async renderMainPage(req, res) {
        const isUserLogged = req.session.user;
        const articles = await Article.findAll({
            order: [
                ['id', 'DESC']
            ],
            limit: 6
        })
        const categories = await Category.findAll()

        return res.render(
            'index',
            {
                articles,
                categories,
                estaLogado: isUserLogged
            }
        )
    }
}

module.exports = new ArticlesControler();
