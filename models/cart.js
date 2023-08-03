const fs = require('fs');
const path = require('path');

const dataDir = path.join(path.dirname(process.mainModule.filename), 'data');
const cartFilePath = path.join(dataDir, 'cart.json');

function createCartFileIfNotExists() {
  const defaultCart = { products: [], totalPrice: 0 };
  fs.writeFile(cartFilePath, JSON.stringify(defaultCart), { flag: 'wx' }, err => {
    if (err) {
      console.log('The cart file already exists.');
    } else {
      console.log('Cart file created successfully.');
    }
  });
}

function readCartFile(callback) {
  fs.readFile(cartFilePath, (err, fileContent) => {
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

function writeCartFile(cart, callback) {
  fs.writeFile(cartFilePath, JSON.stringify(cart), err => {
    if (err) {
      callback(err);
    } else {
      callback(null);
    }
  });
}

module.exports = class Cart {
  static addProduct(id, productPrice) {
    readCartFile((err, cart) => {
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

      writeCartFile(cart, err => {
        if (err) {
          console.log(err);
        }
      });
    });
  }

  static getCart(cb) {
    readCartFile((err, cart) => {
      if (err) {
        createCartFileIfNotExists();
        cb([], 0);
      } else {
        cb(cart.products, cart.totalPrice);
      }
    });
  }

  static deleteProduct(id, productPrice) {
    readCartFile((err, cart) => {
      if (err) {
        console.log(err);
        return;
      }

      const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
      const existingProduct = cart.products[existingProductIndex];

      if (existingProduct) {
        if (existingProduct.qty === 1) {
          // If the product quantity is 1, remove the product from the cart
          cart.products = cart.products.filter(prod => prod.id !== id);
        } else {
          // If the product quantity is more than 1, decrease the quantity by 1
          const updatedProduct = { ...existingProduct };
          updatedProduct.qty = updatedProduct.qty - 1;
          cart.products = [...cart.products];
          cart.products[existingProductIndex] = updatedProduct;
        }

        cart.totalPrice = cart.totalPrice - +productPrice;

        writeCartFile(cart, err => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  }
};
