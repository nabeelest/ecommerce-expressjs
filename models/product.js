const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const p = path.join(rootDir,'data','products.json');


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

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id,cb) {
      getProductsFromFile(products => {
        const product = products.find(p => p.productId === id);
        cb(product);
      });
    }
}
