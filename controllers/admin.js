const Product = require('../models/product');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const fileHelper = require('../util/file');

const ITEMS_PER_PAGE = 3;

exports.getAdminPanel = (req, res, next) => {
    res.render('admin/admin-panel', { title: "Admin Panel - Omega Social" });
};

// Get the Product List
exports.getProductsList = (req, res, next) => {
    const page = +req.query.page || 1; // Get the requested page number from the query parameter, default to 1 if not provided
  
    Product.find()
      .countDocuments() // Count the total number of products
      .then(totalProducts => {
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate the total number of pages
        const skip = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of items to skip
  
        Product.find()
          .skip(skip)
          .limit(ITEMS_PER_PAGE)
          .then(products => {
            res.render('admin/products-list', {
              products: products,
              title: "Omega Shop - Online Store",
              currentPage: page,
              totalPages: totalPages,
            });
          })
          .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

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
    const image = req.file;
    
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
        url: image.path,
        userId: req.user
    });
    if(!image){
        return res.status(422).render('admin/edit-product', {
            title: "Edit - Online Store",
            editing: true,
            errorMessage: 'Attached File is not an image.',
            product: data
        });
    }
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

// Update a Product (POST request)
exports.editProductData = (req, res, next) => {
    const productId = req.params.productId;
    const updatedImage = req.file; // Access the uploaded file
    const editing = req.query.editing;


    Product.findById(productId)
        .then(product => {
            console.log(product);
            res.render('admin/edit-product', { product: product, editing: editing,errorMessage: undefined, title: "Edit - Online Store" });
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};

exports.postEditProductData = (req, res, next) => {
    const data = req.body;
    const image = req.file;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            title: "Edit - Online Store",
            editing: true,
            errorMessage: errors.array()[0].msg,
            product: {
                name: data.name,
                price: data.price,
                description: data.description,
            }
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
            if(image){
                fileHelper.deleteFile(product.url);
                product.url = image.path;
            }

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
exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if(!product){
            return next(new Error('Product Not Found!'));
        }
        fileHelper.deleteFile(product.url);
        return Product.deleteOne({ _id: productId, userId: req.user._id })
    })
    .then(result => {
        res.status(200).json({message: 'Success!'});
    })
    .catch(err => {
        res.status(500).json({message: 'Delete product failed!'});
    });
};
