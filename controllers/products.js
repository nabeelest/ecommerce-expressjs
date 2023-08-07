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
    .then(([rows,fieldData]) => {
        console.log(rows);
        console.log(fieldData);
        res.render('shop/shop',{products: rows, title: "Omega Shop - Online Store"});
    })
    .catch(err => console.log(err));
}