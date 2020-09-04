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
    res.render('index')
})


app.listen(8080, ()=>{
    console.log('O servidor esta rodando')
})