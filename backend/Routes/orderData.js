const express = require('express');
const router = express.Router();

const cors = require('cors');


const Order = require('../models/orders');

router.use(cors()); // Allow all CORS requests, adjust options as needed

// Your route handling code here


router.post('/orderData', async (req, res) => {
    try {
        let data = req.body.order_data;
        let orderDate = req.body.order_date;

        // Prepend order_date to data array
        data.unshift({ Order_date: orderDate });

        // Check if there's an existing order with the email
        let existingOrder = await Order.findOne({ email: req.body.email });

        if (!existingOrder) {
            // If no existing order found, create a new one
            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {
            // If existing order found, update it by pushing new data
            await Order.findOneAndUpdate(
                { email: req.body.email },
                { $push: { order_data: data } }
            );
            res.json({ success: true });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports=router;