const express = require('express')
const { query, matchedData, validationResult } = require('express-validator');
const app = express()
const port = 5000
const mongoDB = require("./database")
mongoDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-requested-With, Content-Type,Accept"
  );
  next();
})

app.use(express.json());
app.get('/', query('person').notEmpty(), (req, res) => {
  res.send('Hello World!')
});

app.use('/api', require("./Routes/CreateUser"));
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})