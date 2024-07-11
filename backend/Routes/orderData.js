const express = require('express');
const router = express.Router();

const cors = require('cors');


const Order = require('../models/orders');

router.use(cors());


router.post('/orderData', async (req, res) => {
    try {
        let data = req.body.order_data;
        let orderDate = req.body.order_date;


        data.unshift({ Order_date: orderDate });


        let existingOrder = await Order.findOne({ email: req.body.email });

        if (!existingOrder) {

            await Order.create({
                email: req.body.email,
                order_data: [data]
            });
            res.json({ success: true });
        } else {

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
router.post('/myorderData', async (req, res) => {
    try {
        let myData = await Order.findOne({ 'email': req.body.email })
        res.json({ orderData: myData })
    } catch (error) {
        res.send("Server Error", error.message)
    }
})

module.exports = router;