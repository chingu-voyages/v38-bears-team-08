const { firebaseAuth, signInWithEmailAndPassword } = require('../../firebase.js');
const signInUserWithEmail = async (email, password) => {
  let userCredential;
  try{
    userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    console.log(userCredential);
  } catch(error) {
    throw {code: error.code, message: error.message};
  }
  return {userId: userCredential.user.uid};
};

module.exports = signInUserWithEmail;