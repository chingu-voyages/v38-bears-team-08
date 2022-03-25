// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
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

const app = initializeApp(firebaseConfig);

/*Current error on this line: analytics not supported in this environment // Figure it out: 

Error:  @firebase/analytics: Analytics: Firebase Analytics is not supported in this environment. 
Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. 
Details: (1) Cookies are not available. (analytics/invalid-analytics-context).
const analytics = getAnalytics(app); */

exports.firebaseApp = app;