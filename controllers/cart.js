const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item');

exports.postCart = (req,res,next) => {
    const productId = req.body.productId;
    let quantity = req.body.quantity;
    let fetchedCart;
    req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({where: {id: productId}});
    })
    .then(products => {
      let product;
      if(products.length > 0){
        product = products[0]; 
      }   
      let newQuantity = 0;
      newQuantity += quantity;
      if(product){
       
      }
      return Product
        .findByPk(productId)
        .then(product => {
          return fetchedCart.addProduct(product,{through: {quantity: newQuantity}})
        })
        .catch(err => console.log(err));
    })
    .then(result => {
      res.redirect('/shop/cart');
    })
}

exports.deleteProduct = (req, res, next) => {
  const productId = req.params.productId;
  req.user.getCart()
    .then(cart => {
      return cart.getProducts({where:{id: productId}})
        .then(products => {
          const product = products[0];
          return product.cartItem.destroy()
            .then(result => {
              res.redirect('/shop/cart');
          })            
          .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    req.user
      .getCart()
      .then(cart => {
        cart.getProducts()
        .then(products => {
          if (products.length === 0) {
            // If the cart is empty, directly render the page with an empty cart.
            return res.render('shop/cart', {
              products: [], 
              totalPrice: 0,
              title: "Omega Shop - Online Store"
            });
          }
          let totalPrice = 0;
          products.forEach(product => {
            if(product.name != null){
              totalPrice += product.price;
            }
          });  
          res.render('shop/cart', {
            products: products,
            totalPrice: totalPrice,
            title: "Omega Shop - Online Store"
          });
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
}
