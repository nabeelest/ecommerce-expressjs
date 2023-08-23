const express = require('express');
const productsController = require('../controllers/products');
const cartController = require('../controllers/cart');

const router = express.Router();

router.get('/',productsController.showProductData);

router.get('/cart', cartController.getCart);

router.get('/checkout', productsController.getCheckout);

router.post('/checkout', productsController.postCheckout);

router.get('/orders', productsController.getOrders);

router.post('/create-order', productsController.postOrder);

router.post('/cart', cartController.postCart)

router.get('/product-detail/:productId', productsController.getProduct);

router.get('/delete-product/:productId', cartController.deleteProduct);


module.exports = router;

