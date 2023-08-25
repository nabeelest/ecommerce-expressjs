const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();

router.get('/',(req,res,next) => {
    const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1] === 'true'
    res.render('index',{title: "Omega Social - Connect with the World",indexCSS: true,isAuthenticated: isLoggedIn});
});

module.exports = router;