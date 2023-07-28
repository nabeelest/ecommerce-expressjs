const express = require('express');
const productsController = require('../controllers/products');
const checkoutController = require('../controllers/products')

const router = express.Router();

router.get('/',productsController.showProductData);

router.get('/cart', productsController.getCart);

router.get('/checkout', productsController.getCheckout);

router.get('/orders', productsController.getOrders);

router.post('/cart', productsController.postCart)

router.get('/product-detail/:productId', productsController.getProduct);

module.exports = router;

