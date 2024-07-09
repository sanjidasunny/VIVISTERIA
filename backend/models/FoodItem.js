const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodCategorySchema = new Schema({
    CategoryName: { type: String, required: true }
}, {
    collection: 'food_category'
});

module.exports = mongoose.model('FoodCategory', foodCategorySchema);