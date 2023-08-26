const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const User = require('./models/user'); 

const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const shopRoutes = require('./routes/shop');
const signupRoutes = require('./routes/signup');
const adminRoutes = require('./routes/admin');
const errors = require('./controllers/errors');
URI = 'mongodb+srv://nabeelest:GxKQiM2gwJNDakkD@cluster0.lbt9rcl.mongodb.net/shop';

const app = express();

const store = new MongoDBStore({
    uri: URI,
    collection: 'sessions'
});

app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.set('view engine','ejs');
app.set('views','views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/user', usersRoutes);
app.use('/shop', shopRoutes);
app.use(indexRoutes);
app.use('/user', signupRoutes);
app.use('/admin', adminRoutes);

// Make sure to place this after all route handlers
app.use(errors.error404);

mongoose.connect(URI)
    .then(result => {
        app.listen(3000);
        console.log('Connected! ')
    })
    .catch(err => {
        console.log(err);
    });
