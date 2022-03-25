//Import dependencies
require('dotenv').config();
const express = require('express');
const router = require('./routes/routeIndex.js');
const { firebaseApp } = require('./firebase.js')
console.log(firebaseApp);
const app = express();
const PORT = process.env.PORT = 3000;

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use('/api',router);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})