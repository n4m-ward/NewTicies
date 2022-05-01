function adminAuth(req,res,next) {
    if(req.session.user){
        next();
    }

    res.redirect('/login')
}

module.exports = adminAuth;
