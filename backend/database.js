const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vivisteria:sunnybunny@cluster0.fjgpc3k.mongodb.net/Vivisteria?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo connected');

        const foodItemsCollection = mongoose.connection.db.collection("food_items");
        const foodCategoryCollection = mongoose.connection.db.collection("food_category");

        // Fetch food_items and food_category
        const foodItems = await foodItemsCollection.find({}).toArray();
        const foodCategories = await foodCategoryCollection.find({}).toArray();

        console.log('Data fetched successfully');
        return { foodItems, foodCategories };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = mongoDB;