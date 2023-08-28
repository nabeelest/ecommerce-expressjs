const express = require('express');
const productsController = require('../controllers/products');
const cartController = require('../controllers/cart');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/',productsController.showProductData);

router.get('/cart', isAuth, cartController.getCart);

router.get('/checkout', isAuth, productsController.getCheckout);

router.post('/checkout', isAuth, productsController.postCheckout);

router.get('/orders', isAuth, productsController.getOrders);

router.post('/create-order', isAuth, productsController.postOrder);

router.post('/cart', isAuth, cartController.postCart)

router.get('/product-detail/:productId', isAuth, productsController.getProduct);

router.get('/delete-product/:productId', isAuth, cartController.deleteProduct);


module.exports = router;

