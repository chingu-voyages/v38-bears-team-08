const registerUser = require('../../services/authenticationService/signUp.js');
const signInUserWithEmail = require('../../services/authenticationService/signIn.js');

const registerWithEmail = async (req, res) => {
  let createdUser;
  if ( !req.body.email || !req.body.password ) {
    res.status(406).json({ 
      message: 'UserName/ Email & Password cannot be empty!' 
    });
  }
  const email = req.body.email, password = req.body.password; 
  try{
    createdUser = await registerUser(email, password);
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
    console.log(loggedInUserData);
  } catch(error) {
    if(error.code == 'auth/wrong-password') {
      res.status(401).json({
        message: 'User not loggedIn. Email and passwords do not match',
      });
    }
  }
};

exports.registerWithEmail = registerWithEmail;
exports.loginWithEmail = loginWithEmail;