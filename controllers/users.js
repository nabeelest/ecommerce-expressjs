const User = require('../models/user');

exports.getSignup = (req,res,next) => {
    res.render('user/signup',{title: "Sign Up - Omega Social"});
}

exports.getLogin = (req,res,next) => {
    res.render('user/login',{title: "Login - Omega Social"});
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email;
    User.findOne({ email: userEmail })
        .then(user => {
            if (user) {
                console.log("Found user:", user);
                if (req.body.password == user.password) {
                    req.session.user = user;
                    req.session.isLoggedIn = true;
                }
            } else {
                console.log("User not found.");
            }
            // Redirect inside the then block
            res.redirect('/');
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.redirect('/'); // Handle error redirect
        });
};

exports.postSignup = (req,res,next) => {
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