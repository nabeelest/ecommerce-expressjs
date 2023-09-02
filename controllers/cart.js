const Product = require('../models/product');

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  const quantity = Number(req.body.quantity || 1); // Default quantity to 1 if not provided
  console.log(productId);

  Product.findById(productId)
    .then(product => {
      console.log(product);
      if (!product) {
        throw new Error('Product not found');
      }
      return req.user.addToCart(product, quantity);
    })
    .then(result => {
      console.log('Product added to cart:', result);
      res.redirect('/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
  });
};

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;

  req.user.removeFromCart(productId)
    .then(result => {
      console.log('Product removed from cart:', result);
      res.redirect('/shop/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
  });
};

exports.getCart = (req, res, next) => {
  req.user.populate('cart.items.productId')
  .then(user => {
      const products = user.cart.items;
      let totalPrice = 0;

      products.forEach(product => {
        if (product.productId) {
          totalPrice += product.productId.price * product.quantity;
        }
      });
      res.render('shop/cart', {
        products: products,
        totalPrice: totalPrice,
        title: 'Omega Shop - Online Store'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
  });
};

