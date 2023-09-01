const express = require('express');
const authController = require('../controllers/auth')
const { check,body } = require('express-validator');
const User = require('../models/user');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', [
        body('username','Username cannot be empty.')
            .trim()
            .notEmpty()
            .isAlphanumeric(),
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email!')
            .trim()
            .normalizeEmail()
            .custom((value, {req}) => {
                return User.findOne({email: value})
                .then(userDoc => {
                    if(userDoc){
                        return Promise.reject('Email already exists!');
                    }
                });
            }),
        body('password','Password should be greater than 5 characters.')
            .trim()    
            .isLength({min: 5})
            .isAlphanumeric()
    ],
    authController.postSignup);

router.get('/login',authController.getLogin);

router.post('/login',[
    body('email')
        .isEmail()
        .trim()
        .normalizeEmail()
        .withMessage('Please enter a valid email!'),
    body('password','Password should be greater than 5 characters.')
        .isLength({min: 5})
        .trim()
        .isAlphanumeric()
], authController.postLogin)

router.post('/logout', authController.postLogout)  

router.get('/forget-password',authController.getForget);

router.post('/forget-password',authController.postForget);

router.get('/reset/:token',authController.getReset);

router.post('/reset',
[
    body('newPassword')
            .isLength({min: 5})
            .withMessage('Password should be Alphanumeric & greater than 5 characters.')
            .isAlphanumeric(),
    body('confirmPassword')
            .custom((value,{req}) => {
                if(value !== req.body.confirmPassword){
                    throw new Error('Passwords should be matching.')
                }
                return true;
            })
],
authController.postReset);


module.exports = router;
