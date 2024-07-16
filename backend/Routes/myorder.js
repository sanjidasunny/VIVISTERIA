const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

router.post('/myorderData', async (req, res) => {
  try {
    const userEmail = req.body.email;

    // Fetch orders from the database based on user's email
    const orders = await Payment.find({ email: userEmail });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // Format the fetched orders into the desired structure
    const formattedOrders = orders.map(order => ({
        orderDate: order.orderDate,
        orderedItems: order.orderedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        
      })),
      
    }));

    res.json({ orderData: formattedOrders });
  } catch (error) {
    console.error('Error fetching order data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

