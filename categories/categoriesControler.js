const express = require('express');
const router =  express.Router();
const Category = require('./Category');
const slugify = require('slugify');
const bodyParser = require('body-parser');
const adminAuth = require('../middlewares/adminAuth');


router.get('/admin/categories/new',adminAuth,(req,res)=>{
    var estaLogado = req.session.user;
    Category.findAll().then(categories =>{
        res.render('admin/categories/new',{estaLogado:estaLogado,categories:categories});
    })

});

router.post("/categories/save",adminAuth,(req,res)=>{
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
});

router.get('/admin/categories',adminAuth,(req,res)=>{
    var estaLogado = req.session.user;
    
    Category.findAll().then(categories =>{
        res.render('admin/categories/index',{categories: categories,estaLogado:estaLogado})
    });
});

router.post('/categories/delete',adminAuth,(req,res)=>{
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

});

router.get('/admin/categories/edit/:id',adminAuth,(req,res)=>{
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

})
router.post('/categories/update',adminAuth,(req,res)=>{
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
})


module.exports = router;