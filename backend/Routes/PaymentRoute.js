const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const FoodCategory = require('../models/FoodCategory')
router.post('/payment', async (req, res) => {
  const { userId, email, orderedItems, totalAmount, paymentMethod } = req.body;

  console.log("Hello")
  try {
    const newPayment = new Payment({
      userId,
      email,
      orderedItems: orderedItems.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      orderDate: new Date(),
      totalAmount,
      paymentMethod,
    });

    await newPayment.save();
    for (const item of orderedItems) {
      const category = await FoodCategory.findOne({ CategoryName: item.category });

      if (category) {
        // Increment the purchased number by the quantity of the item
        category.purchased += item.quantity;
        await category.save(); // Save the updated category document
      } else {
        console.error(`Category ${item.category} not found for item ${item.name}`);
      }
    }

    res.status(201).json({ message: 'Payment details saved successfully!' });
  } catch (err) {
    console.error('Error saving payment:', err);
    res.status(500).json({ error: err });
  }
});

module.exports = router;

