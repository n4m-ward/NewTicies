const Category = require('./Category');
const slugify = require('slugify');
const Article = require("./articles/Article");

class CategoriesControler {
   renderNewCategoriesPage(req, res) {
       var estaLogado = req.session.user;
       Category.findAll().then(categories =>{
           res.render('admin/categories/new',{estaLogado:estaLogado,categories:categories});
       })
   }

   renderAllCategoriesPage(req, res) {
       var estaLogado = req.session.user;

       Category.findAll().then(categories =>{
           res.render('admin/categories/index',{categories: categories,estaLogado:estaLogado})
       });
   }

   renderEditCategoriesPage(req, res) {
       var id = req.params.id;
       var estaLogado = req.session.user;

       if(isNaN(id)){
           res.redirect('/admin/categories');
       }
       else{

       }
       Category.findByPk(id).then(category =>{
           if(category != undefined){

               res.render('admin/categories/edit',{
                   category:category,
                   estaLogado:estaLogado
               });


           } else{
               res.redirect('/admin/categories');
           }
       }).catch(erro =>{
           res.redirect('/admin/categories');
       })
   }

   saveCategories(req, res) {
       var title = req.body.title;
       if(title != undefined){
           Category.create({
               title:title,
               slug:slugify(title)
           }).then(()=>{
               res.redirect("/admin/categories");
           })
       }
       else{
           res.redirect('/admin/categories/new');
       }
   }

   updateCategories(req, res) {
       var id = req.body.id;
       var title = req.body.title;
       var slug = req.body.title;

       Category.update({

           title:title,
           slug:slug
       },{
           where:{
               id:id
           }
       }).then(()=>{
           res.redirect('/admin/categories');
       })
   }

   deleteCategories(req, res) {
       var id = req.body.id;
       if(id != undefined){
           if(!isNaN(id)){

               Category.destroy({
                   where:{
                       id: id
                   }
               }).then(() => {
                   res.redirect("/admin/categories");
               })

           }
           else{
               res.redirect("/admin/categories");
           }
       }
       else{
           res.redirect("/admin/categories");
       }

   }

   renderPageCategoryBySlug(req, res) {
       var estaLogado = req.session.user;
       var slug = req.params.slug;
       Category.findOne({
           where:{
               slug: slug
           },
           include: [{model: Article}]
       }).then( category =>{
           if(category != undefined){

               Category.findAll().then(categories =>{
                   res.render('index',{
                       articles:category.articles,
                       categories:categories,
                       estaLogado:estaLogado
                   })
               })

           } else{
               res.rendirect('/');
           }
       }).catch(err =>{
           res.redirect('/')
       })
   }
}


module.exports = new CategoriesControler();