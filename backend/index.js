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
  res.status(500).send('Something broke!');
});


