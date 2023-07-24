const express = require('express');
const usersController = require('../controllers/users')

const router = express.Router();

router.get('/users', usersController.showUserData);

module.exports = router;

