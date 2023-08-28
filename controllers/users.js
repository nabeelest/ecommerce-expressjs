const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.getSignup = (req,res,next) => {
    res.render('user/signup',{
        title: "Sign Up - Omega Social"    
    });
}

exports.getLogin = (req,res,next) => {
    res.render('user/login',{
        title: "Login - Omega Social"
    });
}

exports.postLogout = (req,res,next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
}

exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email;
    const password = req.body.password;

    User.findOne({ email: userEmail })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password)
                    .then(doMatch => {
                        if (doMatch) {
                            req.session.user = user;
                            req.session.isLoggedIn = true;
                            req.session.save(err => {
                                if (err) {
                                    console.error("Error saving session:", err);
                                    return res.status(500).redirect('/');
                                }
                                res.redirect('/');
                            });
                        } else {
                            res.redirect('/user/login');
                        }
                    })
                    .catch(err => {
                        console.error("Error comparing passwords:", err);
                        res.status(500).redirect('/');
                    });
            } else {
                console.log("User not found.");
                res.redirect('/user/login');
            }
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).redirect('/');
        });
};

exports.postSignup = (req,res,next) => {
    data = req.body;
    User.findOne({email: data.email})
        .then(userDoc => {
            if(userDoc){
                return res.redirect('/user/signup');
            }
            return bcrypt.hash(data.password,12)
                .then(hashedPassword => {
                    const user = new User(
                        {
                        username: data.username, 
                        email: data.email, 
                        password: hashedPassword, 
                        cart: { items: [] }, 
                        country: data.country
                        }
                    );
                    return user.save();
                })
                .then(result => {
                res.render('user/success',{title: "Signup Successful - Omega Social"});
                })
                .catch(err => console.log(err));
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