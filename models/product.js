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
      return db.execute(
        'INSERT INTO products (productId,productName,productPrice,productDescription,productUrl) VALUES (?,?,?,?,?)',
        [this.productId,this.productName,this.productPrice,this.productDescription,this.productUrl]
      );
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

      // Find current product
      this.findById(id)
        .then(currentProduct => {
    
          if (!currentProduct) {
            console.log(`No product found with id ${id}`);
            return;  
          }
    
          // Build update statement
          const updatedFields = Object.keys(newData);
          const setStatements = updatedFields.map(field => `${field} = ?`).join(', ');    
          const values = [...updatedFields.map(field => newData[field]), id];
    
          // Execute update
          return db.execute(
            `UPDATE products SET ${setStatements} WHERE productId = ?`,
            values  
          );
          
        })
        .then(result => {
          console.log('Product updated successfully!');
        })
        .catch(err => {
          console.log(err);
        });
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE productId = ?',[id]);
    }
}
