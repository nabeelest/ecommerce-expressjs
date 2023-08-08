const Product = require('../models/product');

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{title: "Add Product - Omega Shop"});
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findByPk(productId)
    .then(product => {
        res.render('shop/product-detail',{product: product, title: "Omega Shop - Online Store"});
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{title: "Add Product - Omega Shop",orders:[]});
}

exports.showProductData = (req,res,next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/shop',{products: products, title: "Omega Shop - Online Store"});
        })
        .catch(err => console.log(err));
}