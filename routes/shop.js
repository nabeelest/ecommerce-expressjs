const express = require('express');
const productsController = require('../controllers/products');
const checkoutController = require('../controllers/products')

const router = express.Router();

router.get('/shop', productsController.showProductData);

router.get('/shop/cart', productsController.showProductData);

router.get('/shop/checkout', productsController.getCheckout);

router.get('/shop/orders', productsController.getOrders);



module.exports = router;

