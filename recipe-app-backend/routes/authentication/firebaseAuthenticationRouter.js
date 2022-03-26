const express = require('express');
const authRouter = express.Router();
const {registerWithEmail, loginWithEmail} = require('../../controllers/authentication/authController.js');

// Implements SignUp
authRouter.route('/register')
  .post(async(req, res) => {
    try{
      await registerWithEmail(req, res); 
    }catch(error){
      console.log(error);
    }
  });

// Implements SignIn & Logout
authRouter.route('/sessions')
  .post(async(req, res) => {
    try{
      await loginWithEmail(req, res); 
    }catch(error){
      console.log(error);
    }  
  })
  .delete((req, res) => {
    //log out
  });
  

module.exports = authRouter;