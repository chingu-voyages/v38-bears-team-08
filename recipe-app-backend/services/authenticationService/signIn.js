const fetch = require('cross-fetch');

const signInUserWithEmail = async (email, password) => {
  const requestBody = {
    email: email, 
    password: password,
    returnSecureToken: true
  };

  let userCredential;
  try{
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_APIKEY}`, {
      method: 'post',
      body:    JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });
    userCredential = await response.json();
    if(userCredential.error){
      console.log('run this');
      throw {code: userCredential.error.code, message: userCredential.error.message};
    }
  } catch(error) {
    console.log(error);
    throw {code: error.code, message: error.message};
  }
  return {userTokenId: userCredential.idToken};
};

module.exports = signInUserWithEmail;