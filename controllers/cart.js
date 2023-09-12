const Product = require('../models/product');
const stripe = require('stripe')('key');

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
  req.user
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      const successUrl = req.protocol + '://' + req.get('host') + '/shop/order/success';
      const cancelUrl = req.protocol + '://' + req.get('host') + '/shop/order/failure';

      // Check if the cart is empty
      if (products.length === 0) {
        return res.render('shop/cart', {
          products: [],
          totalPrice: 0,
          title: 'Omega Shop - Online Store',
          stripeSessionId: null, // Set stripeSessionId to null if cart is empty
        });
      }

      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(product => ({
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(product.productId.price * 100),
            product_data: {
              name: product.productId.name,
              description: product.productId.description,
            },
          },
          quantity: product.quantity,
        })),
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
      })
      .then(session => {
        const totalPrice = req.user.cart.items.reduce((total, product) => {
          return total + product.productId.price * product.quantity;
        }, 0);
  
        res.render('shop/cart', {
          products: req.user.cart.items,
          totalPrice: totalPrice,
          title: 'Omega Shop - Online Store',
          stripeSessionId: session.id,
        });
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};



