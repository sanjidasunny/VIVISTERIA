const express = require('express');
const cors = require('cors');
const { query } = require('express-validator');
const mongoDB = require('./database');
const createUser = require('./Routes/CreateUser'); // Import the createUser route

const app = express();
const port = 5000;

mongoDB();
//https://vivisteria.vercel.app
const allowCrossDomain = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "https://vivisteria.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

app.use(allowCrossDomain);
app.use(express.json());

app.use('/api', createUser); // Use the createUser route
app.options('https://vivisteria.vercel.app', allowCrossDomain);
app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
