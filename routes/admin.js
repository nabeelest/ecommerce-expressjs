const express = require('express');
const adminController = require('../controllers/admin')

const router = express.Router();

router.get('/',adminController.getAdminPanel);

router.get('/products-list',adminController.getProductsList);

router.get('/add-product', adminController.getProductData);

router.post('/add-product', adminController.postProductData);

router.get('/edit-product/:productId', adminController.editProductData);

router.post('/edit-product', adminController.postEditProductData);

router.get('/delete-product/:productId', adminController.deleteProductData);


module.exports = router;

