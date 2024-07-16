/*
const express = require('express');
const { query } = require('express-validator');
const connectDB = require('./database');
const createUserRoute = require('./Routes/CreateUser');
const displayDataRoute = require('./Routes/DisplayData');
const orderDataRoute = require('./Routes/orderData');
const cors = require('cors');

const app = express();

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors({
  origin: 'https://vivisteria.vercel.app',
  methods: ['POST', 'GET', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api', createUserRoute);
app.use('/api', displayDataRoute);
app.use('/api', orderDataRoute);

// Handle CORS preflight requests
app.options('*', cors());

// Test route
app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

module.exports = app;
*/
const express = require('express');
const cors = require('cors');
const connectDB = require("./database");
const createUserRoute = require('./Routes/CreateUser');
const displayDataRoute = require('./Routes/DisplayData');
const orderDataRoute = require('./Routes/orderData');
const ProfileRoute = require('./Routes/ProfieInfo');
const foodItemRoute = require('./Routes/addNewItem');
const reviewRoute=require('./Routes/reviewPage');
const paymentRoute=require('./Routes/PaymentRoute');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api', createUserRoute);
app.use('/api', displayDataRoute);
app.use('/api', orderDataRoute);
app.use('/api', ProfileRoute);
app.use('/api', foodItemRoute);
app.use('/api', reviewRoute);
app.use('/api', paymentRoute);




// Handle CORS preflight requests
app.options('*', cors());

// Test route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
