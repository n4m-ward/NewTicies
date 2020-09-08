const express = require('express');
const router =  express.Router();
const Category = require('../categories/Category');
const Article = require('./Article');
const slugify = require('slugify');
const adminAuth = require('../middlewares/adminAuth');

router.get('/admin/articles',adminAuth,(req,res)=>{
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
    
})

router.get('/admin/articles/new',adminAuth,(req,res)=>{
    var estaLogado = req.session.user;
    Category.findAll().then(categories =>{
        res.render('../views/admin/articles/new',{categories:categories,estaLogado:estaLogado});
    })
    
})

router.post('/articles/save',(req,res)=>{
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

})

router.post('/articles/delete',adminAuth,(req,res)=>{
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

    
});

router.get('/admin/articles/edit/:id',adminAuth,(req,res)=>{
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
        
})
router.post('/articles/update',(req,res)=>{
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
})

router.get('/articles/page/:num',(req,res)=>{
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
})



module.exports = router;