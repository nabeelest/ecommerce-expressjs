const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');


exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        title: "Add Product - Omega Shop"
    });
}

exports.postCheckout = (req, res, next) => {
    const address = req.body.address;
    const cardDetails = {
        cardnumber: req.body.cardnumber,
        expiry: req.body.expiry,
        cvv: req.body.cvv
    };
    req.user.address = address;
    req.user.card = cardDetails;
    req.user.save();
    res.redirect('/shop/orders'); // Redirect back to the user's profile page
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render('shop/product-detail',{
            product: product, 
            title: "Omega Shop - Online Store"
        });
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.user._id }) // Find orders by the user's ID
        .populate('products.productData') // Populate the 'productData' field in the products array
        .then(orders => {
            const formattedOrders = orders.map(order => ({
                orderId: order._id.toString(),
                orderDate: formatDate(order._id.getTimestamp()),
                totalAmount: calculateTotalAmount(order.products),
                products: order.products.map(item => ({
                    productUrl: item.productData.url,
                    productName: item.productData.name,
                    productPrice: item.productData.price,
                    quantity: item.quantity
                }))
            }));
            res.render('shop/orders', { orders: formattedOrders, title: 'Order History' });
        })
        .catch(err => {
            console.error('Error fetching orders:', err);
            // Handle the error
        });
};

exports.postOrder = (req, res, next) => {
    User.findById(req.user._id)
        .populate('cart.items.productId') // Assuming 'productId' is the field that references the Product model
        .exec()
        .then(user => {
            const products = user.cart.items.map(item => {
                return { 
                    productData: { ...item.productId._doc},
                    quantity: item.quantity
                }
            });

            const order = new Order({
                user: {
                    name: user.username,
                    userId: user._id
                },
                products: products
            });

            return order.save();
        })
        .then(result => {
            console.log('Order created:', result);
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/shop/checkout'); // Redirect to the checkout page
        })
        .catch(err => {
            console.error('Error creating order:', err);
            // Handle the error
        });
};



exports.showProductData = (req,res,next) => {
    Product.find({userId: req.user._id})
        .then(products => {
            res.render('shop/shop',{
                products: products, 
                title: "Omega Shop - Online Store"
            });
        })
        .catch(err => console.log(err));
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateTotalAmount(items) {
    return items.reduce((total, item) => {
        const itemPrice = parseFloat(item.productData.price); // Convert to number if needed
        const itemQuantity = parseInt(item.quantity); // Convert to number if needed

        console.log(`item: ${JSON.stringify(item)}, price=${itemPrice}, quantity=${itemQuantity}`);

        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
            return total + (itemPrice * itemQuantity);
        } else {
            console.error(`Invalid item data: productPrice=${item.productPrice}, quantity=${item.quantity}`);
            return total; // Skip this item's contribution to total
        }
    }, 0);
}

