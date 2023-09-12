const express = require('express');
const adminController = require('../controllers/admin');
const { check, body } = require('express-validator');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();

router.get('/', isAuth, adminController.getAdminPanel);

router.get('/products-list', isAuth, adminController.getProductsList);

router.get('/add-product', isAuth, adminController.getProductData);

router.post('/add-product', [
    body('name','Name must be at least 3 characters long').trim().isLength({ min: 3 }),
    body('description','Description must be at least 15 characters long').trim().isLength({ min: 15 }),
    body('price','Price must be a positive number').trim().isFloat({ min: 0.01 })
], adminController.postProductData);

router.get('/edit-product/:productId', isAuth, adminController.editProductData);

router.post('/edit-product', [
    body('name','Name must be at least 3 characters long').trim().isLength({ min: 3 }),
    body('description','Description must be at least 15 characters long').trim().isLength({ min: 15 }),
    body('price','Price must be a positive number').trim().isFloat({ min: 0.01 }),
], isAuth, adminController.postEditProductData);

router.delete('/delete-product/:productId', isAuth, adminController.deleteProduct);

module.exports = router;
