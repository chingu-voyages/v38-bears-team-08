const fetch = require('cross-fetch');

const resetUserPasswordFromEmail = async (email) => {
  const requestBody = {
    email: email, 
    requestType:'PASSWORD_RESET'
  };

  let responseStatus;
  try{
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_APIKEY}`, {
      method: 'post',
      body:    JSON.stringify(requestBody),
      headers: { 'Content-Type': 'application/json' },
    });
    responseStatus = response.status;
    const userCredential = await response.json();
    // console.log(userCredential);
    if(userCredential.error){
      throw {code: userCredential.error.code, message: userCredential.error.message};
    }
  } catch(error) {
    console.log(error);
    throw {code: error.code, message: error.message};
  }
  return responseStatus;
};

module.exports = resetUserPasswordFromEmail;