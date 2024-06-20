const express = require('express');
const cors = require('cors');
const { query } = require('express-validator');
const mongoDB = require('./database');
const createUser = require('./Routes/CreateUser'); // Import the createUser route

const app = express();
const port = process.env.PORT||5000;

mongoDB();

const corsOptions = {
  origin: 'https://vivisteria.vercel.app',
  credential:true,
  methods:["POST","GET","PUT","DELETE"],
};
app.options("",cors(corsOptions));
app.use(cors({corsOptions}));
app.use(express.json());

app.use('/api', createUser); // Use the createUser route

app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
