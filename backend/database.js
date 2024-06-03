const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://vivisteria:sunnybunny@cluster0.fjgpc3k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const mongoDB = async () => {
try {
    mongoose.set('strictQuery', false)
    mongoose.connect(mongoURI) 
    console.log('Mongo connected')
}
catch(error) {
    console.log(error)
    process.exit()
}
}
module.exports = mongoDB;