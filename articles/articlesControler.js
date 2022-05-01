const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');

 class ArticlesControler {
     renderPageListArticles(req, res) {
         var estaLogado = req.session.user;
         Category.findAll().then(categories =>{
             Article.findAll({
                 include:[{model:Category}]
             }).then(articles =>{
                 res.render("admin/articles/index",{
                     articles:articles,
                     estaLogado:estaLogado,
                     categories:categories})
             })
         })
     }

     renderPageCreateArticles(req, res) {
         var estaLogado = req.session.user;
         Category.findAll().then(categories =>{
             res.render('../views/admin/articles/new',{categories:categories,estaLogado:estaLogado});
         })
     }

     createArticle(req, res) {
         var title = req.body.title;
         var body = req.body.body;
         var category = req.body.category;

         Article.create({
             title:title,
             slug:slugify(title),
             body:body,
             categoriaId:category

         }).then(()=>{
             res.redirect('/admin/articles');
         })
     }

     deleteArticle(req, res) {
         var id = req.body.id;
         if(id != undefined){
             if(!isNaN(id)){

                 Article.destroy({
                     where:{
                         id: id
                     }
                 }).then(() => {
                     res.redirect("/admin/articles");
                 })

             }
             else{
                 res.redirect("/admin/articles");
             }
         }
         else{
             res.redirect("/admin/articles");
         }
     }

     renderPageEditArticle(req, res) {
         var id = req.params.id;
         var estaLogado = req.session.user;
         Article.findByPk(id).then(article =>{
             if(article != undefined){
                 Category.findAll().then(categories =>{
                     res.render('admin/articles/edit',{categories:categories,article:article,estaLogado:estaLogado});
                 })

             } else{
                 res.redirect('/');
             }
         }).catch(err =>{
             res.redirect('/admin/categories');
         })
     }

     editArticle(req, res) {
         var id = req.body.id;
         var title = req.body.title;
         var body = req.body.body;
         var category = req.body.category;

         Article.update({
             title:title,
             body:body,
             categoriaId:category,
             slug:slugify(title)},{
             where:{
                 id:id
             }
         }).then(()=>{
             res.redirect('/admin/articles');
         }).catch(err =>{
             res.redirect('/')
         })
     }

     listArticleByPage(req, res) {
         var estaLogado = req.session.user;
         var page = req.params.num;
         var offset = 0;

         if(isNaN(page) || offset == 1){
             offset = 0;
         } else{
             offset = parseInt(page) * 6 ;
         }

         Article.findAndCountAll({

             limit:6,
             offset: offset,
             order:[
                 ['id','DESC']
             ],

         }).then(articles =>{

             var next;
             if(offset + 6 >= articles.count){
                 next = false
             } else{
                 next = true;
             }


             var result = {
                 page:parseInt(page),
                 next: next,
                 articles: articles
             }


             Category.findAll().then(categories =>{
                 res.render('admin/articles/page',{result:result, categories:categories,estaLogado:estaLogado})
             })

         })
     }

     renderPageArticleBySlug(req, res) {
         var estaLogado = req.session.user;
         var slug = req.params.slug;
         Article.findOne({
             where: {
                 slug: slug
             },
             include:[{model:Category}]

         }).then(article =>{
             if(article != undefined){
                 Category.findAll().then(categories =>{
                     res.render('article',{
                         article:article,
                         categories:categories,
                         estaLogado:estaLogado
                     })
                 })
             } else{
                 res.redirect('/');
             }
         }).catch(err =>{
             res.redirect('/');
         })
     }

     renderMainPage(req, res) {
         var estaLogado = req.session.user;
         Article.findAll({
             order:[
                 ['id','DESC']
             ],
             limit:6
         }).then(articles =>{
             Category.findAll().then(categories =>{
                 res.render('index',{articles:articles,categories:categories,estaLogado:estaLogado})
             })
         })
     }
 }

module.exports = new ArticlesControler();