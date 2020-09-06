const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./databases/database');

const categoriesControler = require('./categories/categoriesControler');
const articlesControler  = require('./articles/articlesControler');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

app.set('view engine','ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

connection.authenticate()
.then(()=> {
    console.log('conexão feita com o banco de dados')
})
.catch((error)=>{
    console.log(error)
})


app.use('/',categoriesControler);
app.use('/',articlesControler)

app.get('/',(req,res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit:6
    }).then(articles =>{
        Category.findAll().then(categories =>{
            res.render('index',{articles:articles,categories:categories})
        })
    })
    
})

app.get('/:slug',(req,res)=>{
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
                    categories:categories 
                    })
            })
        } else{
            res.redirect('/');
        }
    }).catch(err =>{
        res.redirect('/');
    })
})
app.get('/category/:slug',(req,res) =>{
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
                    })
            })

        } else{
            res.rendirect('/');
        }
    }).catch(err =>{
        res.redirect('/')
    })
})


app.listen(8080, ()=>{
    console.log('O servidor esta rodando')
})