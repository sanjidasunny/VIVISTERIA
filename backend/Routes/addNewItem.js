const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem'); // Import your Mongoose model

// Route to add a new food item
router.post('/addFoodItem', async (req, res) => {
    const { name, CategoryName, img, options, description } = req.body;

    try {
        const newItem = new FoodItem({
            name,
            CategoryName,
            img,
            options,
            description
        });

        // Save the new item to the database
        await newItem.save();

        res.status(201).json(newItem); // Respond with the newly created item
    } catch (error) {
        console.error('Error adding new item:', error);
        res.status(500).json({ error: 'Failed to add new item' });
    }
});

module.exports = router;
