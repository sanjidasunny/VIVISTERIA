const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vivisteria:sunnybunny@cluster0.fjgpc3k.mongodb.net/Vivisteria?retryWrites=true&w=majority&appName=Cluster0'

const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo connected');


        const collection = mongoose.connection.db.collection("food_items");
        const data = await collection.find({}).toArray();
        console.log();



    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
module.exports = mongoDB;