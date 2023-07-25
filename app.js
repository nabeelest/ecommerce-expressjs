//modules
const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
const expressHbs = require('express-handlebars');

//routes import
const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const productsRoutes = require('./routes/add-product');
const shopRoutes = require('./routes/shop');
const signupRoutes = require('./routes/signup');

//controllers
const errors = require('./controllers/errors')

//app
const app = express();

// app.engine('hbs',expressHbs({layoutsDir:'views/handlebars/layouts',defaultLayout: 'main-layout',extname:'hbs'}));
app.set('view engine','ejs');
app.set('views','views/ejs');

app.use(bodyParser.urlencoded({extended: false}));

//middlewares
app.use(express.static(path.join(rootDir,'public')));

//routes
app.use(usersRoutes);
app.use(shopRoutes)
app.use(indexRoutes);
app.use(productsRoutes)
app.use(signupRoutes);

app.use(errors.error404);

app.listen(3000);