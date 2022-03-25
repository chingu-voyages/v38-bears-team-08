const express = require('express');
const userRouter = express.Router();

userRouter.route('/')
  .get(async(req, res) => {
    res.json({message: "User route works"})   
  })

module.exports = userRouter ;