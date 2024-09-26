import { initializeApp } from 'firebase/app';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDicxgSWEfcnw2sHCp7eJyCXm9mbQeF1JI",
    authDomain: "fir-login-7b798.firebaseapp.com",
    projectId: "fir-login-7b798",
    storageBucket: "fir-login-7b798.appspot.com",
    messagingSenderId: "7484503944",
    appId: "1:7484503944:web:f6db15222a5efc2e7dac3d",
    measurementId: "G-2WCVPCLRZT"
  };
  

const app = initializeApp(firebaseConfig);
export default app;