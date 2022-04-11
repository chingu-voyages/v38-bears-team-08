// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB1v2AsG6CdjQFJPpt9ynDLBFb0bOuTeFA',
  authDomain: 'find-recipes-by-ingredie-b32f2.firebaseapp.com',
  databaseURL: 'https://find-recipes-by-ingredie-b32f2-default-rtdb.firebaseio.com',
  projectId: 'find-recipes-by-ingredie-b32f2',
  storageBucket: 'find-recipes-by-ingredie-b32f2.appspot.com',
  messagingSenderId: '837496072096',
  appId: '1:837496072096:web:297c06a01cdad2847226c5'
}

// Initialize Firebase
const db = initializeApp(firebaseConfig)
const auth = getAuth(db)
// console.log('firebaseConfig', auth)
export { db, auth }
