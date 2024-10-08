const express = require('express');
const cors = require('cors');
const connectDB = require("./database");
const createUserRoute = require('./Routes/CreateUser');
const displayDataRoute = require('./Routes/DisplayData');
//const orderDataRoute = require('./Routes/orderData');
const ProfileRoute = require('./Routes/ProfieInfo');
const foodItemRoute = require('./Routes/addNewItem');
const reviewRoute = require('./Routes/reviewPage');
const paymentRoute = require('./Routes/PaymentRoute');
const myOrderRoute = require('./Routes/myorder');

const app = express();
const port = 5000;

// Connect to MongoDB
connectDB();
const allowedOrigins = [
  'http://localhost:3000',
  'https://vivisteria.vercel.app'
];




// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'GET', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'authToken'],
}));

// Body parsing middleware
app.use(express.json());

// Routes
app.use('/api', createUserRoute);
app.use('/api', displayDataRoute);
app.use('/api', ProfileRoute);
app.use('/api', foodItemRoute);
app.use('/api', reviewRoute);
app.use('/api', paymentRoute);
app.use('/api', myOrderRoute);

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
  console.log(`Server running on port ${port}`);
});
module.exports = app;
