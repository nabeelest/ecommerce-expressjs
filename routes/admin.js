const express = require('express');
const adminController = require('../controllers/admin');
const { check, body } = require('express-validator');

const router = express.Router();

router.get('/', adminController.getAdminPanel);

router.get('/products-list', adminController.getProductsList);

router.get('/add-product', adminController.getProductData);

router.post('/add-product', [
    body('name','Name must be at least 3 characters long').trim().isLength({ min: 3 }),
    body('description','Description must be at least 15 characters long').trim().isLength({ min: 15 }),
    body('price','Price must be a positive number').trim().isFloat({ min: 0.01 }),
    body('url','Invalid URL format').trim().isURL()
], adminController.postProductData);

router.get('/edit-product/:productId', adminController.editProductData);

router.post('/edit-product', [
    body('name','Name must be at least 3 characters long').trim().isLength({ min: 3 }),
    body('description','Description must be at least 15 characters long').trim().isLength({ min: 15 }),
    body('price','Price must be a positive number').trim().isFloat({ min: 0.01 }),
    body('url','Invalid URL format').trim().isURL()
], adminController.postEditProductData);

router.get('/delete-product/:productId', adminController.deleteProductData);

module.exports = router;
