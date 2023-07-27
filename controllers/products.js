const uuid = require('uuid');
const Product = require('../models/product');


exports.getProductData = (req,res,next) => {
    res.render('admin/add-product',{title: "Add Product - Omega Shop"});
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{title: "Add Product - Omega Shop"});
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-detail',{product: product, title: "Omega Shop - Online Store"});
    });
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{title: "Add Product - Omega Shop",orders:[]});
}

exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const productId = uuid.v4();
    const product = new Product(data.productName,data.productDescription,data.productPrice,data.productUrl,productId);  
    product.save();
    res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
}

exports.showProductData = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('shop/shop',{products: products, title: "Omega Shop - Online Store"});
    });
}