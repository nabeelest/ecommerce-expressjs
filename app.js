//modules
const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

//routes import
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

//routes
app.use('/user',usersRoutes);
app.use('/shop',shopRoutes)
app.use(indexRoutes);
app.use('/user',signupRoutes);
app.use('/admin',adminRoutes)

app.use(errors.error404);

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
