const express = require('express');
const router = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const { CategoriesControler } = require("./src/Controllers/CategoriesControler");
const { ArticlesControler } = require("./src/Controllers/ArticlesControler");
const { UserController } = require('./src/Controllers/UserControler');


router.get('/admin/categories/new', adminAuth, CategoriesControler.renderNewCategoriesPage);
router.post("/categories/save", adminAuth, CategoriesControler.saveCategories);
router.get('/admin/categories', adminAuth, CategoriesControler.renderAllCategoriesPage);
router.post('/categories/delete', adminAuth, CategoriesControler.deleteCategories);
router.get('/admin/categories/edit/:id', adminAuth, CategoriesControler.renderEditCategoriesPage)
router.post('/categories/update', adminAuth, CategoriesControler.updateCategories)
router.get('/category/:slug', CategoriesControler.renderPageCategoryBySlug)

router.get('/login', UserController.renderLoginPage)
router.get('/logout', UserController.logout)
router.post('/authenticate', UserController.authenticateUser)
router.get('/admin/users', adminAuth, UserController.renderPageListUsers)
router.get('/admin/users/create', adminAuth, UserController.renderPageCreateUsers)
router.post('/users/create', adminAuth, UserController.createUser)
router.post('/users/delete', adminAuth, UserController.deleteUser);

router.get('/admin/articles', adminAuth, ArticlesControler.renderPageListArticles)
router.get('/admin/articles/new', adminAuth, ArticlesControler.renderPageCreateArticles)
router.post('/articles/save', ArticlesControler.createArticle)
router.post('/articles/delete', adminAuth, ArticlesControler.deleteArticle);
router.get('/admin/articles/edit/:id', adminAuth, ArticlesControler.renderPageEditArticle)
router.post('/articles/update', ArticlesControler.editArticle)
router.get('/articles/page/:num', ArticlesControler.listArticleByPage)
router.get('/:slug', ArticlesControler.renderPageArticleBySlug)
router.get('/', ArticlesControler.renderMainPage)


module.exports = router;
