const express = require('express');
const router = express.Router();
const errors = require('../controllers/errors');

router.get('/505',errors.error505);
router.use(errors.error404);

module.exports = router;