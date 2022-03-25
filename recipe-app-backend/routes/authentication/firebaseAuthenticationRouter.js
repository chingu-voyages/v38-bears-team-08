const express = require('express');
const authRouter = express.Router();
const {registerWithEmail} = require('../../controllers/authentication/authController.js');
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
// authRouter.route('/sessions')
// .get(async(req, res) => {
//   console.log(res);
//   let result, userName, password 
//   // const result = await registerUser(userName, password);
//   console.log(result);    
// })
// .delete((req, res) => {
//   //log out
// });
  

module.exports = authRouter;