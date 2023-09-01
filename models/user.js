const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1 // Assuming default quantity is 1
        }
      }
    ]
  },
  token: {type: String},
  tokenExpiry: {type: Date},
  country: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  card: {
    cardnumber: {
      type: String
    },
    cvv: {
      type: Number
    },
    expiry: {
      type: String
    }
  }
});

userSchema.methods.addToCart = async function (product, quantity) {
  const cartProductIndex = this.cart.items.findIndex(
    (cp) => cp.productId.toString() === product._id.toString()
  );

  if (cartProductIndex >= 0) {
    // Product already exists in the cart, update quantity
    this.cart.items[cartProductIndex].quantity += quantity;
  } else {
    // Product does not exist in the cart, add as a new item
    this.cart.items.push({
      productId: product._id,
      quantity: quantity
    });
  }

  return this.save();
};

userSchema.methods.removeFromCart = async function (productId) {
  this.cart.items = this.cart.items.filter(
    (item) => item.productId.toString() !== productId.toString()
  );
  
  return this.save();
};

userSchema.methods.clearCart = async function () {
  this.cart = {items: []};
  return this.save();
};


module.exports = mongoose.model('User', userSchema);



// const mongoDb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongoDb.ObjectId;


// class User {
//   constructor (username, email, password, cart, country, id, address, card) {
//     this.username = username;
//     this.email = email;
//     this.password = password;
//     this.cart = cart || { items: [] };
//     this.country = country;
//     this._id = id;
//     this.address = address;
//     this.card = card || {};
//   }
  
//   updateAddressAndCard(address, cardDetails) {
//     this.address = address;
//     this.card = cardDetails;
//     const db = getDb();
//     return db.collection('users').updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { address: this.address, card: this.card } }
//     );
//   }

  
//   addToCart(product,quantity) {
//     const db = getDb();
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//         return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = quantity;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//         // Product already exists in the cart, increase quantity
//         newQuantity = Number(this.cart.items[cartProductIndex].quantity) + quantity;
//         updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//         // Product does not exist in the cart, add as a new item
//         updatedCartItems.push({
//             productId: new ObjectId(product._id),
//             quantity: newQuantity
//         });
//     }

//     const updatedCart = { items: updatedCartItems };

//     return db.collection('users').updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//     );
// }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(item => item.productId);

//     return db.collection('products')
//         .find({ _id: { $in: productIds } })
//         .toArray()
//         .then(products => {
//             return products.map(product => {
//                 const cartItem = this.cart.items.find(item => {
//                     return item.productId.toString() === product._id.toString();
//                 });
//                 return {
//                     product: product,
//                     quantity: cartItem.quantity
//                 };
//             });
//         });
//   }

//   removeFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//         return item.productId.toString() !== productId.toString();
//     });

//     const updatedCart = { items: updatedCartItems };

//     const db = getDb();
//     return db.collection('users').updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//     );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart() // Retrieve cart items
//         .then(cartItems => {
//             const order = {
//                 items: cartItems,
//                 user: {
//                     _id: new ObjectId(this._id),
//                     username: this.username
//                 }
//             };
//             return db.collection('orders').insertOne(order); // Insert order into orders collection
//         })
//         .then(result => {
//             this.cart = { items: [] }; // Clear the cart after order is created
//             return db.collection('users').updateOne(
//                 { _id: new ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//             );
//         });
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this)
//       .then(result => {
//         console.log(result);
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }

//   static findById(id) {
//     const db = getDb();
//     return db.collection('users').findOne({_id: new ObjectId(id)})
//     .then(user => {
//       return user;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }
  
//   static fetchAll() {
//     const db = getDb();
//     return db.collection('users').find().toArray()
//     .then(users => {
//       return users;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db.collection('users').deleteOne({_id: new ObjectId(id)})
//     .then(results => {
//       console.log("Product Deleted!");
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }
// }

// module.exports = User; 