const express = require('express');
const { query } = require('express-validator');
const mongoDB = require('./database');
const createUserRoute = require('./Routes/CreateUser'); 
const displayDataRoute = require('./Routes/DisplayData');
const orderDataRoute = require('./Routes/orderData');
const bodyParser = require("body-parser"); router.use(bodyParser.json());
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

mongoDB(); 

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
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
