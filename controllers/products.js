const uuid = require('uuid');
const Product = require('../models/product');
const Cart = require('../models/cart');




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

// I will fix project with this /shop/cart
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
            counter++;
          if (counter === totalProducts) {
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



exports.showProductData = (req,res,next) => {
    Product.fetchAll(products => {
        res.render('shop/shop',{products: products, title: "Omega Shop - Online Store"});
    });
}