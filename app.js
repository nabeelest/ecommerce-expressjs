//modules
const express = require('express');
const path = require('path');
const rootDir = require('./util/path');
const bodyParser = require('body-parser');
const sequelize = require('./util/database');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');
// const OrderDetail = require('./models/order-detail');

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

app.use((req,res,next) => {
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
})

//middlewares
app.use(express.static(path.join(rootDir,'public')));

//routes
app.use('/user',usersRoutes);
app.use('/shop',shopRoutes)
app.use(indexRoutes);
app.use('/user',signupRoutes);
app.use('/admin',adminRoutes)

app.use(errors.error404);

Product.belongsTo(User, {constraints: true, onDelete:'CASCADE'});
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{ through: OrderItem });
// Order.hasOne(OrderDetail, {onDelete: "CASCADE"});
// OrderDetail.belongsTo(Order);


sequelize
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user){
            return User.create({
                username: 'nabeelest',
                email: 'iesafzay@gmail.com',
                password: 'sacredpass'
            });
        }
        return user;   
    })
    .then(user => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
