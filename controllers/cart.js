const Product = require('../models/product');

exports.postCart = (req,res,next) => {
    const productId = req.body.productId;
    let quantity = Number(req.body.quantity);
    Product.findById(productId).then(product => {
      return req.user.addToCart(product,quantity);
    })
    .then(result => {
      console.log(result);
      res.redirect('/shop/cart');
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
    req.user.removeFromCart(productId)
        .then(result => {
            console.log('Product removed from cart:', result);
            res.redirect('/shop/cart'); // Redirect back to the cart page
        })
        .catch(err => {
            console.error('Error removing product from cart:', err);
            // Handle the error
        });
}

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      totalPrice = 0;
      products.forEach(product => {
        totalPrice = totalPrice + Number(product.product.price) * product.quantity;
        console.log(totalPrice);
      });
      res.render('shop/cart', {
        products: products,
        totalPrice: totalPrice,
        title: "Omega Shop - Online Store"
      });        
    })
    .catch(err => {
      console.error('Error fetching cart:', err);
    });
};


