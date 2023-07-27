const express = require('express');
const usersController = require('../controllers/users')

const router = express.Router();

router.get('/showusers', usersController.showUserData);

module.exports = router;

