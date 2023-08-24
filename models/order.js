
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  products: [{
    productData: {type:Object},
    quantity:{type: Number,required: true}
  }],
  user: {
    name: {type: String,required: true},
    userId: {type: Schema.Types.ObjectId,required: true,ref: 'User'},
  }
});



module.exports = mongoose.model('Order',orderSchema);

// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Order {
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('orders').find().toArray()
//     .then(orders => {
//       return orders;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }
// }

// module.exports = Order; 