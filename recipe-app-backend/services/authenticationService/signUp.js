const { firebaseAuth, createUserWithEmailAndPassword } = require('../../firebase.js');
const registerUser = async (email, password) => {
  let userCredential;
  try{
    userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  } catch(error) {
    throw {code: error.code, message: error.message};
  }
  return {userId: userCredential.user.uid, createdAt: userCredential.metadata};
};

module.exports = registerUser;