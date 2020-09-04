const express = require('express');
const router =  express.Router();

router.get('/articles',(req,res)=>{
    res.send("rotas de artigos")
});



module.exports = router;