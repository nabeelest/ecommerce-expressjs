const express = require('express');
const productsController = require('../controllers/products')

const router = express.Router();

router.get('/add-product', productsController.getProductData);

router.post('/add-product', productsController.postProductData);


module.exports = router;
