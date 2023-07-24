const User = require('../models/user');

exports.getUserData = (req,res,next) => {
    res.render('signup',{title: "Sign Up - Omega Social",signupCSS: true});
}

exports.postUserData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const user = new User(data.username,data.email,data.password,data.country);  
    user.save();
    // console.log(User.fetchAll());
    res.render('success',{title: "Signup Successful - Omega Social",successCSS: true});
}

exports.showUserData = (req,res,next) => {
    User.fetchAll(users => {
        res.render('users',{users: users, title: "Users Signed Up", hasUsers: users.length > 0? true : false, usersCSS: true});
    });
}