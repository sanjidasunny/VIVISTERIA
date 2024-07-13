const express = require('express');
const router = express.Router();
const FoodItem = require('../models/FoodItem');
const FoodCategory = require('../models/FoodCategory');

router.post('/foodData', async (req, res) => {
    try {
        const foodItems = await FoodItem.find({});
        const foodCategories = await FoodCategory.find({});

        res.send([foodItems, foodCategories]);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.delete('/foodData/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await FoodItem.findByIdAndDelete(id);
        res.status(200).send({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.put('/foodData/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedItem = await FoodItem.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).send(updatedItem);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});
router.post('/foodCategory', async (req, res) => {
    try {
        const foodCategories = await FoodCategory.find({});
        res.send([foodCategories]);
    } catch (e) {
        console.error(e.message);
        res.status(500).send("Server Error");
    }
})

module.exports = router;