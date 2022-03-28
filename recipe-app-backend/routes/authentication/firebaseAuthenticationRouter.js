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
    //TODO: Reasearch on how to revoke tokenId client. Firebase docs say they last for at least an hour but 
    // neeed to find out if they can be revoked immediately 
  });
  

module.exports = authRouter;