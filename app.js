//modules
const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');

//database 
const mongoConnect = require('./util/database').mongoConnect;
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
    User.findById('64e6493038bb59d9f81776f0')
    .then(user => {
        req.user = new User(
            user.username,
            user.email,
            user.password,
            user.cart,
            user.country,
            user._id);
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

mongoConnect(() => {
    app.listen(3000);
});

