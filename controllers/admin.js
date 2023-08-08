const Product = require('../models/product');
const uuid = require('uuid');

exports.getAdminPanel = (req,res,next) => {
    res.render('admin/admin-panel',{title: "Admin Panel - Omega Social"});
}

// Get the Product List
exports.getProductsList = (req,res,next) => {
    Product.fetchAll()
        .then(([products]) => {
            res.render('admin/products-list',{products: products, title: "Omega Shop - Online Store"});
        })
        .catch(err => console.log(err));
}

// Add a Product
exports.getProductData = (req,res,next) => {
    const editing = req.query.editing;
    res.render('admin/edit-product',{title: "Add Product - Omega Shop",editing: editing});
}

exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const productId = uuid.v4();
    const product = new Product(data.productName,data.productDescription,data.productPrice,data.productUrl,productId);  
    product.save()
        .then(() => {
            res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
        })
        .catch(err => console.log(err));
}

// Edit a Product
exports.editProductData = (req,res,next) => {
    const productId = req.params.productId;
    const editing = req.query.editing;
    Product.findById(productId)
        .then(([product]) => {
            res.render('admin/edit-product',{product: product[0],editing: editing, title: "Edit - Online Store"});
        })
        .catch(err => console.log(err));
}

exports.postEditProductData = (req,res,next) => {
    data = req.body;
    Product.editById(data.productId,data);
    res.render('admin/product-edit-success',{product: data, title: "Edited Successfully - Online Store"});
}

// Delete A Product
exports.deleteProductData = (req,res,next) => {
    const productId = req.params.productId;    
    console.log(productId)
    Product.deleteById(productId);
    res.redirect('/admin/products-list');
}
