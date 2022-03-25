//Import dependencies
// import express from 'express';
// import router from './routes/routeIndex.js';

const express = require('express');
const router = require('./routes/routeIndex.js');

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