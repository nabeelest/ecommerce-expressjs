exports.error404 = (req,res,next)=>{
    res.status(404).render('errors/404',{title:'Page Not Found - Omega Social', errorCSS: true})
}

exports.error505 = (req,res,next)=>{
    res.status(505).render('errors/505',{title:'Error 505  - Omega Social', errorCSS: true});
}