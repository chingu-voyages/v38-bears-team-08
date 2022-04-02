const registerUser = require('../../services/authenticationService/signUp.js');
const signInUserWithEmail = require('../../services/authenticationService/signIn.js');
const resetUserPasswordFromEmail = require('../../services/authenticationService/resetPassword.js');

const registerWithEmail = async (req, res) => {
  let createdUser;
  if ( !req.body.email || !req.body.password || !req.body.userName ) {
    res.status(406).json({ 
      message: 'UserName, Email & Password cannot be empty!' 
    });
  }
  const email = req.body.email, password = req.body.password, userName = req.body.userName; 
  console.log(email, password, userName);
  try{
    createdUser = await registerUser(email, password, userName);
    console.log(createdUser);
    res.status(200).json({
      message: 'User created', 
      metaData: createdUser,
    });
  } catch(error) {
    console.log(error);
    if(error.code == 'auth/email-already-in-use') {
      res.status(200).json({
        message: 'User not created. Email is already in use',
      });
    }

    else if(error.code == 'auth/invalid-email') {
      res.status(422).json({
        message: 'User not created. Email is in an invalid format',
      });
    }

    else {
      res.status(500).json({ 
        message: 'Saving user failed!',
        error: error,
      });
    }
  }
};

const loginWithEmail = async(req,res) => {
  let loggedInUserData;
  try{
    if ( !req.body.email || !req.body.password ) {
      res.status(406).json({ 
        message: 'UserName/ Email & Password cannot be empty!' 
      });
    }
    const email = req.body.email, password = req.body.password; 
    loggedInUserData = await signInUserWithEmail(email, password);
    res.status(200).json({
      message: 'User Logged in Succesfuly', 
      metaData: loggedInUserData,
    });
  } catch(error) {
    if(error.message == 'INVALID_PASSWORD') {
      res.status(401).json({
        message: 'User not logged In. Email and passwords do not match',
      });
    } else if(error.message == 'EMAIL_NOT_FOUND') {
      res.status(401).json({
        message: 'User not logged In. Email address does not exist in our Database',
      });
    } else if(error.message == 'INVALID_EMAIL') {
      res.status(401).json({
        message: 'User not logged In. Invalid email. Please counter check and add client side validation',
      });
    } 
    else {
      res.status(500).json({ 
        message: 'Authentication failed! Please Try again',
        error: error,
      });
    }
  }
};

const forgotUserPassword = async(req, res) => {
  try{
    if ( !req.body.email ) {
      res.status(406).json({ 
        message: 'UserName/ Email & Password cannot be empty!' 
      });
    }
    const email = req.body.email;
    const responseStatus = await resetUserPasswordFromEmail(email);
    // console.log('response status: ', responseStatus);
    if(responseStatus == 200){
      res.status(200).json({
        message: 'User password reset email has been sent',
      });
    }
  } catch(error){
    console.log(error);
    if(error.message == 'EMAIL_NOT_FOUND') {
      res.status(400).json({
        message: 'User email is not in our User Database or Email is in an invalid format. Please retry with correct email',
      });
    } else if(error.message == 'INVALID_EMAIL') {
      res.status(400).json({
        message: 'User email is in an invalid format. Please retry with correct email',
      });
    } 
  }
};

exports.registerWithEmail = registerWithEmail;
exports.loginWithEmail = loginWithEmail;
exports.forgotUserPassword = forgotUserPassword;