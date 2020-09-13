const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./databases/database');
const session = require('express-session');

const categoriesControler = require('./categories/categoriesControler');
const articlesControler  = require('./articles/articlesControler');
const usersControler = require('./users/usersControler');

const Article = require('./articles/Article');
const Category = require('./categories/Category');

app.set('view engine','ejs');




// por ser um projeto de curta escala. onde apenas o admnistrador do projeto pode fazer login
// vou usar o armazenamento padrao de cookies, por nao ter necessidade de algo maior


app.use(session({
    secret: "milotic",
    cookie: {
        maxAge: 6000000
    }

}))

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
app.use('/',usersControler)



app.get('/',(req,res) =>{
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
    
})

app.get('/:slug',(req,res)=>{
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
})
app.get('/category/:slug',(req,res) =>{
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
})


app.listen(3000, ()=>{
    console.log('O servidor esta rodando')
})