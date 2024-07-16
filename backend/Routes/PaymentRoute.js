const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

router.post('/payment', async (req, res) => {
  const { userId, orderedItems, totalAmount, paymentMethod } = req.body;

  try {
    const newPayment = new Payment({
      userId,
      orderedItems,
      totalAmount,
      paymentMethod,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment details saved successfully!' });
  } catch (err) {
    console.error('Error saving payment:', err);
    res.status(500).json({ error: 'Failed to save payment details' });
  }
});

module.exports = router;
