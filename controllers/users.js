const User = require('../models/user');

exports.getUserData = (req,res,next) => {
    res.render('user/signup',{title: "Sign Up - Omega Social"});
}

exports.postUserData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const user = new User(data.username,data.email,data.password,data.country);  
    user.save();
    // console.log(User.fetchAll());
    res.render('user/success',{title: "Signup Successful - Omega Social"});
}

exports.showUserData = (req,res,next) => {
    User.findAll()
        .then(users => {
            res.render('user/users',{users: users, title: "Users Signed Up"});
        })
        .catch(err => {console.log(err)});

}