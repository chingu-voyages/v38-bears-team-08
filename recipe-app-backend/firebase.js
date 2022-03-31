// Import the functions you need from the SDKs you need
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Firebase configuration
// const firebaseConfig = {
//   apiKey: process.env.FIREBASE_APIKEY,
//   authDomain: process.env.FIREBASE_AUTHDOMAIN,
//   projectId: process.env.FIREBASE_PROJECTID,
//   storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
//   appId: process.env.FIREBASE_APP_ID,
//   measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

const app = initializeApp({
  credential: cert({
    'type': process.env.FIREBASE_TYPE,
    'project_id': process.env.FIREBASE_PROJECT_ID,
    'private_key_id': process.env.FIREBASE_PRIVATE_KEY_ID,
    'private_key': process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    'client_email': process.env.FIREBASE_CLIENT_EMAIL,
    'client_id': process.env.FIREBASE_CLIENT_ID,
    'auth_uri': process.env.FIREBASE_AUTH_URI,
    'token_uri': process.env.FIREBASE_TOKEN_URI,
    'auth_provider_x509_cert_url': process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    'client_x509_cert_url': process.env.FIREBASE_CLIENT_X509_CERT_URL
  })
});
const firebaseAuth = getAuth(app);

exports.firebaseApp = app;
exports.firebaseAuth = firebaseAuth;
