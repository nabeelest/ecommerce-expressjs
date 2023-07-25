const uuid = require('uuid');
const Product = require('../models/product');


exports.getProductData = (req,res,next) => {
    res.render('add-product',{title: "Add Product - Omega Shop"});
}

exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const productId = uuid.v4();
    const product = new Product(data.productName,data.productDescription,data.productPrice,data.productUrl,productId);  
    product.save();
    res.render('product-success',{title: "Product Added - Omega Shop",product: data});
}

exports.showProductData = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('shop',{products: products, title: "Omega Shop - Online Store"});
    });
}