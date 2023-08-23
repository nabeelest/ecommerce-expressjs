const mongoDb = require('mongodb');
const getDb = require('../util/database').getDb;

class Order {
  static fetchAll() {
    const db = getDb();
    return db.collection('orders').find().toArray()
    .then(orders => {
      return orders;
    })
    .catch(err => {
      console.log(err);
    });
  }
}

module.exports = Order; 