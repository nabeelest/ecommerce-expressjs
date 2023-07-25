const express = require('express');
const productsController = require('../controllers/products')

const router = express.Router();

router.get('/shop', productsController.showProductData);

module.exports = router;

