const express = require('express');
const usersController = require('../controllers/auth')

const router = express.Router();

router.get('/showusers', usersController.showUserData);

module.exports = router;

