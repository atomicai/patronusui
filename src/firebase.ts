// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDDw4OZzSps-s2S6-evaw4x_yr28HlQQBA',
  authDomain: 'atomtool-291a8.firebaseapp.com',
  projectId: 'atomtool-291a8',
  storageBucket: 'atomtool-291a8.appspot.com',
  messagingSenderId: '942535567752',
  appId: '1:942535567752:web:c03c47e3e0384500cb323d',
  measurementId: 'G-MXEKBXEV71'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
const analytics = getAnalytics(app)
