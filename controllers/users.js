const User = require('../models/user');

exports.getUserData = (req,res,next) => {
    res.render('user/signup',{title: "Sign Up - Omega Social"});
}

exports.postUserData = (req,res,next) => {
    data = req.body;
    const user = new User(
        {
        username: data.username, 
        email: data.email, 
        password: data.password, 
        cart: { items: [] }, 
        country: data.country
        }
    );
    user.save().then(result => {
        res.render('user/success',{title: "Signup Successful - Omega Social"});
    })
    .catch(err => console.log(err));
}

exports.showUserData = (req,res,next) => {
    User.find()
        .then(users => {
            res.render('user/users',{users: users, title: "Users Signed Up"});
        })
        .catch(err => {console.log(err)});
}