const uuid = require('uuid');
const Product = require('../models/product');
const Cart = require('../models/cart');



exports.getProductData = (req,res,next) => {
    res.render('admin/add-product',{title: "Add Product - Omega Shop"});
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{title: "Add Product - Omega Shop"});
}

exports.postCart = (req,res,next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId,product.productPrice) 
    });
    res.redirect('/shop/cart')
}

exports.getCart = (req, res, next) => {
    Cart.getCart((products, totalPrice) => {
      const productIds = products.map((product) => product.id);
      const productsArray = [];
  
      let counter = 0;
      const totalProducts = productIds.length;
  
      productIds.forEach((productId) => {
        Product.findById(productId, (product) => {
          if (product) {
            productsArray.push(product);
          } else {
            console.warn(`Product with ID ${productId} not found.`);
          }
  
          // Check if all products have been fetched
          counter++;
          if (counter === totalProducts) {
            // Process 'productsArray' further or send it as a response to the client
            res.render('shop/cart',{products: productsArray,totalPrice: totalPrice, title: "Omega Shop - Online Store"});
          }
        });
      });
    });
  };
  

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        res.render('shop/product-detail',{product: product, title: "Omega Shop - Online Store"});
    });
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders',{title: "Add Product - Omega Shop",orders:[]});
}

exports.postProductData = (req,res,next) => {
    data = req.body;
    console.log(data);
    const productId = uuid.v4();
    const product = new Product(data.productName,data.productDescription,data.productPrice,data.productUrl,productId);  
    product.save();
    res.render('admin/product-success',{title: "Product Added - Omega Shop",product: data});
}

exports.showProductData = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('shop/shop',{products: products, title: "Omega Shop - Online Store"});
    });
}