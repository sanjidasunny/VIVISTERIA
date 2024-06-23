const express = require('express');
const cors = require('cors');
const { query } = require('express-validator');
const mongoDB = require('./database');
const createUser = require('./Routes/CreateUser');

const app = express();
const port = 5000;

mongoDB();

// Allow requests from http://vivisteria.vercel.app
app.use(cors({
  origin: 'http://vivisteria.vercel.app',
  methods: ['POST', 'GET', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api', createUser);

app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
