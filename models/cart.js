const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

function readCartFile(filePath, callback) {
  fs.readFile(filePath, (err, fileContent) => {
    if (err) {
      callback(err, null);
    } else {
      try {
        const cart = JSON.parse(fileContent);
        callback(null, cart);
      } catch (error) {
        callback(error, null);
      }
    }
  });
}

function writeCartFile(filePath, cart, callback) {
  fs.writeFile(filePath, JSON.stringify(cart), err => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

module.exports = class Cart {

static addProduct(id, productPrice) {
  
  readCartFile(p, (err, cart) => {
    if (err) {
      console.log(err);
      return;
    }

    const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
    const existingProduct = cart.products[existingProductIndex];
    let updatedProduct;

    if (existingProduct) {
      updatedProduct = { ...existingProduct };
      updatedProduct.qty = updatedProduct.qty + 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updatedProduct;
    } else {
      updatedProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updatedProduct];
    }

    cart.totalPrice = cart.totalPrice + +productPrice;

    writeCartFile(p, cart, err => {
      if (err) {
        console.log(err);
      }
    });
  });
}
  static getCart(cb) {
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      cb(cart.products,cart.totalPrice);
    });
  }
};
