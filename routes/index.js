const express = require('express');
const path = require('path');
const rootDir = require('../util/path');

const router = express.Router();

router.get('/',(req,res,next) => {
    res.render('index',{title: "Omega Social - Connect with the World",indexCSS: true});
});

module.exports = router;