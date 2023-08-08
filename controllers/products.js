const Product = require('../models/product');

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

exports.showProductData = (req,res,next) => {
    Product.fetchAll()
        .then( ([prods]) => {
            console.log(prods);
            res.render('shop/shop',{products: prods, title: "Omega Shop - Online Store"});
        })
        .catch(err => console.log(err));
}