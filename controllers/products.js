const Product = require('../models/product');
const Order = require('../models/order');

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{title: "Add Product - Omega Shop"});
}

exports.postCheckout = (req, res, next) => {
    const address = req.body.address;
    const cardDetails = {
        cardnumber: req.body.cardnumber,
        expiry: req.body.expiry,
        cvv: req.body.cvv
    };
    req.user.updateAddressAndCard(address, cardDetails)
        .then(result => {
            console.log('User details updated:', result);
            res.redirect('/shop/orders'); // Redirect back to the user's profile page
        })
        .catch(err => {
            console.error('Error updating user details:', err);
            // Handle the error
        });
}

exports.getProduct = (req,res,next) => {
    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        res.render('shop/product-detail',{product: product, title: "Omega Shop - Online Store"});
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res) => {
    Order.fetchAll()
        .then(orders => {
            const formattedOrders = orders.map(order => ({
                orderId: order._id.toString(),
                orderDate: formatDate(order._id.getTimestamp()),
                totalAmount: calculateTotalAmount(order.items),
                products: order.items.map(item => ({
                    productUrl: item.product.url,
                    productName: item.product.name,
                    productPrice: item.product.price,
                    quantity: item.quantity
                }))
            }));
            res.render('shop/orders', { orders: formattedOrders, title: 'Order History' });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('An error occurred while fetching orders.');
        });
};

exports.postOrder = (req,res,next) => {
    req.user.addOrder()
        .then(result => {
            console.log('Order created:', result);
            res.redirect('/shop/checkout'); // Redirect to the orders page
        })
        .catch(err => {
            console.error('Error creating order:', err);
            // Handle the error
        });
}

exports.showProductData = (req,res,next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/shop',{products: products, title: "Omega Shop - Online Store"});
        })
        .catch(err => console.log(err));
}

function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateTotalAmount(items) {
    return items.reduce((total, item) => {
        const itemPrice = parseFloat(item.product.price); // Convert to number if needed
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

