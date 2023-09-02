const Product = require('../models/product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

exports.getAdminPanel = (req, res, next) => {
    res.render('admin/admin-panel', { title: "Admin Panel - Omega Social" });
};

// Get the Product List
exports.getProductsList = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products-list', { products: products, title: "Omega Shop - Online Store" });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });};

// Add a Product
exports.getProductData = (req, res, next) => {
    const editing = req.query.editing;
    res.render('admin/edit-product', {
        title: "Add Product - Omega Shop",
        editing: editing,
        errorMessage: null,
        product: {
            name: null,
            price: null,
            description: null,
            url: null
        }
    });
};

exports.postProductData = (req, res, next) => {
    const data = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: "Add Product - Omega Shop",
            editing: false,
            errorMessage: errors.array()[0].msg,
            product: data
        });
    }
    
    const product = new Product({
        name: data.name,
        price: data.price,
        description: data.description,
        url: data.url,
        userId: req.user
    });
    product.save()
        .then(result => {
            res.render('admin/product-success', { title: "Product Added - Omega Shop", product: data });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};

// Edit a Product
exports.editProductData = (req, res, next) => {
    const productId = req.params.productId;
    const editing = req.query.editing;
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product', { product: product, editing: editing, title: "Edit - Online Store" });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });};

exports.postEditProductData = (req, res, next) => {
    const data = req.body;

    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: "Edit - Online Store",
            editing: true,
            errorMessage: errors.array()[0].msg,
            product: data
        });
    }

    Product.findById(data.id)
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            if (product.userId.toString() !== req.user._id.toString()) {
                return res.redirect('/admin/products-list');
            }
            product.name = data.name;
            product.price = data.price;
            product.description = data.description;
            product.url = data.url;

            return product.save()
                .then(result => {
                    console.log('UPDATED PRODUCT!');
                    res.render('admin/product-edit-success', {
                        product: result,
                        title: 'Edited Successfully - Online Store'
                    });
                });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};

// Delete A Product
exports.deleteProductData = (req, res, next) => {
    const productId = req.params.productId;
    Product.deleteOne({ _id: productId, userId: req.user._id })
        .then(result => {
            res.redirect('/admin/products-list');
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};
