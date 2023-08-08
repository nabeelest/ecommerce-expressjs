const Product = require('../models/product');
const uuid = require('uuid');

exports.getAdminPanel = (req,res,next) => {
    res.render('admin/admin-panel',{title: "Admin Panel - Omega Social"});
}

// Get the Product List
exports.getProductsList = (req,res,next) => {
    Product.findAll()
        .then((products) => {
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
    Product.create({
        productName: data.productName,
        productDescription: data.productDescription,
        productPrice: data.productPrice,
        productUrl: data.productUrl,
        productId: productId
    })
    .then(() => {
        res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
    })
    .catch(err => console.log(err));
}

// Edit a Product
exports.editProductData = (req,res,next) => {
    const productId = req.params.productId;
    const editing = req.query.editing;
    Product.findByPk(productId)
        .then(product => {
            res.render('admin/edit-product',{product: product,editing: editing, title: "Edit - Online Store"});
        })
        .catch(err => console.log(err));
}

exports.postEditProductData = (req,res,next) => {
    data = req.body;
    Product.findByPk(data.productId)
        .then(product => {
            product.productName = data.productName;
            product.productDescription = data.productDescription;
            product.productPrice = data.productPrice;
            product.productUrl = data.productUrl;
            return product.save();
        })
        .then(result => {
            console.log(result);
            console.log('UPDATED PRODUCT!');
            res.render('admin/product-edit-success',{product: data, title: "Edited Successfully - Online Store"});

        })
        .catch(err => console.log(err));
}

// Delete A Product
exports.deleteProductData = (req,res,next) => {
    const productId = req.params.productId;    
    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DELETED SUCCESSFULLY!');
            res.redirect('/admin/products-list');
        }) 
        .catch(err => console.log(err));
}
