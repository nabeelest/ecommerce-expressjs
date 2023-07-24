const express = require('express');
const usersController = require('../controllers/users')

const router = express.Router();

router.get('/signup', usersController.getUserData);

router.post('/signup', usersController.postUserData);


module.exports = router;
