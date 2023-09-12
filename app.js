const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const User = require('./models/user');
const flash = require('connect-flash');

const usersRoutes = require('./routes/users');
const indexRoutes = require('./routes/index');
const shopRoutes = require('./routes/shop');
const signupRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const errors = require('./routes/errors');
const rootDir = require('./util/path');

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


app.use(flash());


app.use((req, res, next) => {
    if (!req.session.user) {
      return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
});

app.set('view engine','ejs');
app.set('views','views');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'images'); // Destination directory where uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      cb(null, `${timestamp}-${file.originalname}`); // Set the filename for the uploaded file
    },
  });

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true); // Accept the file
    } else {
      cb(null, false);
    }
  };
  

app.use(bodyParser.urlencoded({extended: false}));
app.use(multer({storage: fileStorage,fileFilter: fileFilter}).single('image'));
app.use(express.static(path.join(rootDir, 'public')));
app.use('/images', express.static(path.join(rootDir, 'images')));


app.use('/user', usersRoutes);
app.use('/shop', shopRoutes);
app.use(indexRoutes);
app.use('/user', signupRoutes);
app.use('/admin', adminRoutes);

// Make sure to place this after all route handlers
app.use(errors);


app.use((error,req,res,next) => {
    console.log(error);
    res.status(505).render('errors/505',{title:'Error 505  - Omega Social', errorCSS: true});
});

mongoose.connect(URI)
    .then(result => {
        app.listen(3000);
        console.log('Connected! ')
    })
    .catch(err => {
        console.log(err);
    });
