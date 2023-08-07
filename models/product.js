const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');
const db = require('../util/database');


const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
}


module.exports = class Product {
    constructor(name,description,price,url,uuid) {
        this.productName = name;
        this.productDescription = description;
        this.productPrice = price;
        this.productUrl = url;
        this.productId = uuid;
    }

    save() {
        getProductsFromFile(products => {
          products.push(this);
          fs.writeFile(p, JSON.stringify(products), err => {
            console.log(err);
          });
        });
    }

    static fetchAll() {
      return db.execute('SELECT * FROM products');
    }

    static deleteById(id) {
      getProductsFromFile(products => {
        const updatedProducts = products.filter(p => p.productId !== id);
        fs.writeFile(p, JSON.stringify(updatedProducts), err => {
          if (err) {
            console.log(err);
          } else {
            console.log(`Product with productId ${id} has been deleted successfully.`);
          }
        });
      });
    }

    static editById(id, newData) {
      getProductsFromFile(products => {
        const productIndex = products.findIndex(p => p.productId === id);
    
        if (productIndex !== -1) {
          products[productIndex] = {
            ...products[productIndex],
            ...newData,
            productId: id, // Ensure the productId remains unchanged
          };
    
          fs.writeFile(p, JSON.stringify(products), err => {
            if (err) {
              console.log(err);
            } else {
              console.log(`Product with productId ${id} has been edited successfully.`);
            }
          });
        } else {
          console.log(`Product with productId ${id} not found.`);
        }
      });
    }    

    static findById(id,cb) {
      getProductsFromFile(products => {
        const product = products.find(p => p.productId === id);
        cb(product);
      });
    }
}
