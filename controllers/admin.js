const Product = require('../models/product');
const uuid = require('uuid');

exports.getAdminPanel = (req,res,next) => {
    res.render('admin/admin-panel',{title: "Admin Panel - Omega Social"});
}

exports.getProductsList = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('admin/products-list',{products: products, title: "Omega Shop - Online Store"});
    });
}

exports.getProductData = (req,res,next) => {
    res.render('admin/edit-product',{title: "Add Product - Omega Shop",path:'/admin/add-product'});
}

exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const productId = uuid.v4();
    const product = new Product(data.productName,data.productDescription,data.productPrice,data.productUrl,productId);  
    product.save();
    res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
}

exports.editProductData = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('admin/edit-product',{product: product, title: "Edit - Online Store",path:'/admin/edit-product'});
    });
}

exports.postEditProductData = (req,res,next) => {
    data = req.body;
    Product.editById(data.productId,data);
    res.render('admin/product-edit-success',{product: data, title: "Edited Successfully - Online Store"});
}

exports.deleteProductData = (req,res,next) => {
    const productId = req.params.productId;    
    console.log(productId)
    Product.deleteById(productId);
    res.redirect('/admin/products-list');
}
