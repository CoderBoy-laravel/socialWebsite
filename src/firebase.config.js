// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDskoEiFuT-3cR1rxqc1pB75Sg-CxorAd0",
  authDomain: "blog-cf9f9.firebaseapp.com",
  projectId: "blog-cf9f9",
  storageBucket: "blog-cf9f9.appspot.com",
  messagingSenderId: "764015612557",
  appId: "1:764015612557:web:0cc5e15123436c5ca648c4",
  measurementId: "G-Q6MCPRM299"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);