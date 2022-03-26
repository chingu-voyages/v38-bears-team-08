const { firebaseAuth } = require('../../firebase.js');
const registerUser = async (email, password, userName) => {
  let userCredential;
  try{
    userCredential = await firebaseAuth.createUser({email: email, password: password, displayName: userName});
  } catch(error) {
    throw {code: error.code, message: error.message};
  }
  return {userId: userCredential.uid, createdAt: userCredential.metadata.creationTime};
};

module.exports = registerUser;