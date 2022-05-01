const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./databases/database');
const session = require('express-session');
const route = require('./routes')


app.set('view engine','ejs');
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


app.use('/', route);

app.listen(process.env.PORT, ()=>{
    console.log('O servidor esta rodando')
})