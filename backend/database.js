const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vivisteria:sunnybunny@cluster0.fjgpc3k.mongodb.net/Vivisteria?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Mongo connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;
