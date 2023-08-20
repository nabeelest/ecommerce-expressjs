const Product = require('../models/product');

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
    Product.create({
        name: data.name,
        description: data.description,
        price: data.price,
        url: data.url,
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
    Product.findByPk(data.id)
        .then(product => {
            product.name = data.name;
            product.description = data.description;
            product.price = data.price;
            product.url = data.url;
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
