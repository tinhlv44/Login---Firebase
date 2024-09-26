// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from '@firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDicxgSWEfcnw2sHCp7eJyCXm9mbQeF1JI",
  authDomain: "fir-login-7b798.firebaseapp.com",
  projectId: "fir-login-7b798",
  storageBucket: "fir-login-7b798.appspot.com",
  messagingSenderId: "7484503944",
  appId: "1:7484503944:web:f6db15222a5efc2e7dac3d",
  measurementId: "G-2WCVPCLRZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

// Các dịch vụ
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };


