const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodItemSchema = new Schema({
    name: { type: String, required: true },
    CategoryName: { type: String, required: true },
    img: { type: String, required: true },
    options: { type: Array, required: true },
    description: { type: String, required: true }
}, {
    collection: 'food_items' // Specify the collection name explicitly
});


module.exports = mongoose.model('FoodItem', foodItemSchema);
