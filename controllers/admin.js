const Product = require('../models/product');


exports.getAdminPanel = (req,res,next) => {
    res.render('admin/admin-panel',{title: "Admin Panel - Omega Social"});
}

exports.getProductsList = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('admin/products-list',{products: products, title: "Omega Shop - Online Store"});
    });
}