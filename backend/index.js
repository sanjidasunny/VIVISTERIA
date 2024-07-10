const express = require('express');
const cors = require('cors');
const connectDB = require("./database");
const createUserRoute = require('./Routes/CreateUser');
const displayDataRoute = require('./Routes/DisplayData');
const orderDataRoute = require('./Routes/orderData');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();

// CORS middleware
app.use(cors({
  origin: 'http://localhost:3000',
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
