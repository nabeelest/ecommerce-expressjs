//modules
const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');

//database 
const mongoose = require('mongoose');
const User = require('./models/user');


// //routes import
const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const shopRoutes = require('./routes/shop');
const signupRoutes = require('./routes/signup');
const adminRoutes = require('./routes/admin');

//controllers
const errors = require('./controllers/errors')

//app
const app = express();

// app.engine('hbs',expressHbs({layoutsDir:'views/handlebars/layouts',defaultLayout: 'main-layout',extname:'hbs'}));
app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));

//middlewares
app.use(express.static(path.join(rootDir,'public')));

app.use((req,res,next) => {
    User.findById('64e7b03253ee8ddb5a019a2d')
    .then(user => {
        req.user = user;
        next(); // Don't forget to call next() to continue to the next middleware/route handler
    })
    .catch(err => console.log(err));
});

// //routes
app.use('/user',usersRoutes);
app.use('/shop',shopRoutes);
app.use(indexRoutes);
app.use('/user',signupRoutes);
app.use('/admin',adminRoutes);

app.use(errors.error404); 

mongoose.connect('mongodb+srv://nabeelest:GxKQiM2gwJNDakkD@cluster0.lbt9rcl.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        app.listen(3000);
        console.log('Connected! ')
    })
    .catch(err => {
        console.log(err);
    })
