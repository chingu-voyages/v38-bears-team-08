// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase-admin/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase-admin/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp({
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
const firebaseAuth = getAuth(app);

exports.firebaseApp = app;
exports.firebaseAuth = firebaseAuth;
// exports.createUserWithEmailAndPassword = firebaseAuth.createUser;
exports.signInWithEmailAndPassword = signInWithEmailAndPassword;