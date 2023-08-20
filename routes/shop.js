const express = require('express');
const productsController = require('../controllers/products');
const cartController = require('../controllers/cart');
// const checkoutController = require('../controllers/products')

const router = express.Router();

router.get('/',productsController.showProductData);

router.get('/cart', cartController.getCart);

router.get('/checkout', productsController.getCheckout);

// router.post('/process-checkout', productsController.postCheckout);

router.get('/orders', productsController.getOrders);

router.post('/cart', cartController.postCart)

router.get('/product-detail/:productId', productsController.getProduct);

router.get('/delete-product/:productId', cartController.deleteProduct);


module.exports = router;

