const express = require('express');
const adminController = require('../controllers/admin')

const router = express.Router();

router.get('/admin',adminController.getAdminPanel);

router.get('/admin/products-list',adminController.getProductsList);



module.exports = router;

