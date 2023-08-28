const Product = require('../models/product');

exports.getAdminPanel = (req,res,next) => {
    res.render('admin/admin-panel',{title: "Admin Panel - Omega Social"});
}

// Get the Product List
exports.getProductsList = (req,res,next) => {
    Product.find()
        .then(products => {
            res.render('admin/products-list',{products: products, title: "Omega Shop - Online Store"});
        })
        .catch(err => console.log(err));
}

// Add a Product
exports.getProductData = (req,res,next) => {
    const editing = req.query.editing;
    res.render('admin/edit-product',{
        title: "Add Product - Omega Shop",
        editing: editing
    });
}


exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const product = new Product({
        name: data.name,
        price: data.price,
        description: data.description,
        url: data.url,
        userId: req.user
    });
    product.save()
    .then(result => {
        res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
    })
    .catch(err => console.log(err));
}

// Edit a Product
exports.editProductData = (req,res,next) => {
    const productId = req.params.productId;
    const editing = req.query.editing;
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product',{product: product,editing: editing, title: "Edit - Online Store"});
        })
        .catch(err => console.log(err));
}

exports.postEditProductData = (req, res, next) => {
    const data = req.body;

    Product.findById(data.id)
        .then(product => {
            if (!product) {
                return res.status(404).send('Product not found');
            }
            product.name = data.name;
            product.price = data.price;
            product.description = data.description;
            product.url = data.url;
            
            return product.save();
        })
        .then(result => {
            console.log('UPDATED PRODUCT!');
            res.render('admin/product-edit-success', {
                product: result,
                title: 'Edited Successfully - Online Store'
            });
        })
        .catch(err => {
            console.error('Update error:', err);
            res.status(500).send('Update operation failed');
        });
};

  

// Delete A Product
exports.deleteProductData = (req,res,next) => {
    const productId = req.params.productId;    
    Product.findByIdAndRemove(productId)
        .then(result => {
            res.redirect('/admin/products-list');
        })
        .catch(err => console.log(err));
}
