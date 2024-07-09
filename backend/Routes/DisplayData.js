const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const FoodCategory = require('../models/FoodCategory');

router.post('/foodData', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({});
        const foodCategories = await FoodCategory.find({});

        console.log('Fetched Food Items:', foodItems);  // Log fetched food items
        console.log('Fetched Food Categories:', foodCategories);  // Log fetched food categories

        res.send([foodItems, foodCategories]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
