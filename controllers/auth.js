const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'iesafzay@gmail.com',
        pass: 'hmhaodjjzvxaiwbq'
    }
});

exports.getReset = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ token: token, tokenExpiry: { $gt: Date.now() } })
        .then(user => {
            res.render('user/reset', {
                title: "Reset Password - Omega Social",
                errorMessage: null,
                userId: user._id.toString(),
                token: token
            });
        })
        .catch(err => console.log(err));
};

exports.postReset = (req, res, next) => {
    const newPassword = req.body.newPassword;
    const confirmPassword = req.body.confirmPassword;
    const userId = req.body.userId;
    const token = req.body.token;

    User.findOne({
        token: token,
        tokenExpiry: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            // Hash password
            bcrypt.hash(confirmPassword, 12)
                .then(hashedPassword => {
                    user.token = null;
                    user.tokenExpiry = null;
                    user.password = hashedPassword;
                    return user.save();
                })
                .then(result => {
                    console.log('password resetted!')
                    // Send reset success email
                    transporter.sendMail({
                        from: "Omega Social <iesafzay@gmail.com>",
                        subject: "Password Reset!",
                        to: user.email,
                        html: "<p>Your Password has been reset!</p>"
                    })
                    console.log('email sent!')
                    res.redirect('/');
                })
                .catch(err => {
                    const error = new Error(err);
                    error.httpStatusCode = 500;
                    return next(error); 
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });};

exports.getForget = (req, res, next) => {
    res.render('user/forget-password', {
        title: "Forget Password - Omega Social",
        errorMessage: null
    });
};

exports.postForget = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/user/forget-password');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    res.redirect('/user/forget-password');
                }
                else {
                    user.token = token;
                    user.tokenExpiry = Date.now() + 3600000;
                    return user.save();
                }
            })
            .then(result => {
                transporter.sendMail({
                    from: "Omega Social <iesafzay@gmail.com>",
                    subject: "Password Reset Request",
                    to: req.body.email,
                    html: `<p>You requested password reset.</p>
                    <p>Click this <a href="http://localhost:3000/user/reset/${token}">Link</a> to reset the password<p>`
                })
                res.redirect('/');
            })
            .catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error); 
            });
    });
};

exports.getSignup = (req, res, next) => {
    res.render('user/signup', {
        title: "Sign Up - Omega Social",
        errorMessage: null,
        oldInput: {
            email: '',
            password: '',
            username: '',
            country: ''
        }
    });
};

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('user/login', {
        title: "Login - Omega Social",
        errorMessage: message,
        oldInput: {
            email: '',
            password: ''
        }
    });
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/');
    })
};

exports.postLogin = (req, res, next) => {
    const userEmail = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('user/login', {
            title: "Login - Omega Social",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: userEmail,
                password: password
            }
        });
    }

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
                res.redirect('/user/login');
            }
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).redirect('/');
        });
};

exports.postSignup = (req, res, next) => {
    const data = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('user/signup', {
            title: "Sign Up - Omega Social",
            errorMessage: errors.array()[0].msg,
            oldInput: {
                email: data.email,
                password: data.password,
                username: data.username,
                country: data.country
            }
        });
    }

    // Hash password
    bcrypt.hash(data.password, 12)
        .then(hashedPassword => {
            const user = new User({
                username: data.username,
                email: data.email,
                password: hashedPassword,
                cart: { items: [] },
                country: data.country
            });
            return user.save();
        })
        .then(result => {
            transporter.sendMail({
                from: "Omega Social <iesafzay@gmail.com>",
                subject: "Welcome to Omega Social!",
                to: data.email,
                html: "<p>Welcome to Omega Social! Thank you for signing up.</p>"
            });
            res.render('user/success', { title: 'Signup Successful - Omega Social' });
        })
        .catch(err => {
            console.error(err); // Log the error
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};


exports.showUserData = (req, res, next) => {
    User.find()
        .then(users => {
            res.render('user/users', { users: users, title: "Users Signed Up" });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });};
