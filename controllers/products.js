const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');
const PDFDocument = require('pdfkit');

const ITEMS_PER_PAGE = 3; // Adjust the number of items per page as needed



exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        title: "Add Product - Omega Shop"
    });
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;

    Order.findById(orderId).then(order =>{
        if(!order){
            return next(new Error("Order not found."));
        }
        if (order.user.userId.toString() !== req.user._id.toString()){
            return next(new Error('Unauthorized'));
        }
        const invoiceName = `invoice-${orderId}.pdf`;
        const invoicePath = path.join(rootDir, 'data', 'invoices', invoiceName);  
        const pdfDoc = new PDFDocument();

        // const pdfStream = fs.createReadStream(invoicePath);
        // res.setHeader('Content-Type', 'application/pdf');
        // res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
        // pdfStream.pipe(res);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);
        pdfDoc.fontSize(12).text(`Order Date: ${order.orderDate}`, { align: 'left' });
        pdfDoc.fontSize(12).text(`Total Amount: $${order.totalAmount}`, { align: 'left' });

        pdfDoc.pipe(fs.createWriteStream(invoicePath))
        pdfDoc.pipe(res);

        pdfDoc.fontSize(14).text(`Invoice for Order #${orderId}`, { align: 'center' });

        pdfDoc.end();
    })
    .catch(err => next(err));
};


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
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); 
    });
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
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
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
            res.redirect('/shop');        
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error); 
        });
};



exports.showProductData = (req, res, next) => {
    const page = +req.query.page || 1; // Get the requested page number from the query parameter, default to 1 if not provided
  
    Product.find({ userId: req.user._id })
      .countDocuments() // Count the total number of products
      .then(totalProducts => {
        const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE); // Calculate the total number of pages
        const skip = (page - 1) * ITEMS_PER_PAGE; // Calculate the number of items to skip
  
        Product.find({ userId: req.user._id })
          .skip(skip)
          .limit(ITEMS_PER_PAGE)
          .then(products => {
            res.render('shop/shop', {
              products: products,
              title: "Omega Shop - Online Store",
              currentPage: page,
              totalPages: totalPages,
            });
          })
          .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
          });
      })
      .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  };

function formatDate(date) {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function calculateTotalAmount(items) {
    return items.reduce((total, item) => {
        const itemPrice = parseFloat(item.productData.price); // Convert to number if needed
        const itemQuantity = parseInt(item.quantity); // Convert to number if needed


        if (!isNaN(itemPrice) && !isNaN(itemQuantity)) {
            return total + (itemPrice * itemQuantity);
        } else {
            console.error(`Invalid item data: productPrice=${item.productPrice}, quantity=${item.quantity}`);
            return total; // Skip this item's contribution to total
        }
    }, 0);
}

