const express = require('express');
const { query } = require('express-validator');
const mongoDB = require('./database');
const createUserRoute = require('./Routes/CreateUser'); 
const displayDataRoute = require('./Routes/DisplayData');
const orderDataRoute = require('./Routes/orderData');
const cors = require('cors');
//const helmet = require('helmet'); // Import helmet for security headers

const app = express();
const port = process.env.PORT || 5000; // Use PORT environment variable or default to 5000

mongoDB(); // Connect to MongoDB

// Middleware
app.use(cors({
  origin: 'https://vivisteria.vercel.app',
  methods: ['POST', 'GET', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json()); 

// Routes
app.use('/api', createUserRoute); 
app.use('/api', displayDataRoute);
app.use('/api', orderDataRoute);
app.options('*', cors()); 
app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!');
});


app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});