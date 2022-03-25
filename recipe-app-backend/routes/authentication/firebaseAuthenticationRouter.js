const express = require('express');
const authRouter = express.Router();
const registerUser = require('../../services/authenticationService/signUp.js');
// Has SignIn & Log
authRouter.route('/register')
  .post(async(req, res) => {
    const result = await registerUser(userName, password);
    console.log(result);    
  })

module.exports = authRouter;