const Product = require('../models/product');
const Cart = require('../models/cart');

exports.postCart = (req,res,next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId,product.productPrice) 
    });
    res.redirect('/shop/cart')
}

exports.deleteProduct = (req,res,next) => {
    const productId = req.params.productId;    
    Product.findById(productId, product => {
      productPrice = product.productPrice;
      Cart.deleteProduct(productId, productPrice);
      res.redirect('/shop/cart');
    });
}

exports.getCart = (req, res, next) => {
    Cart.getCart((products, totalPrice) => {
      if (products.length === 0) {
        // If the cart is empty, directly render the page with an empty cart.
        return res.render('shop/cart', {
          products: [], // Fix the typo here from "proucts" to "products"
          totalPrice: 0,
          title: "Omega Shop - Online Store"
        });
      }

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
            res.render('shop/cart', {
              products: productsArray,
              totalPrice: totalPrice,
              title: "Omega Shop - Online Store"
            });
          }
        });
      });
    });
}
