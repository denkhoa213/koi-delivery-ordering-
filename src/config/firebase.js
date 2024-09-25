// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSsfl6lexyyhmfi3GkimorXc6X8YBrnXc",
  authDomain: "koi-delivery-ordering.firebaseapp.com",
  projectId: "koi-delivery-ordering",
  storageBucket: "koi-delivery-ordering.appspot.com",
  messagingSenderId: "582204918666",
  appId: "1:582204918666:web:a7310be99463199ded9673",
  measurementId: "G-FECV5L72M5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();
export {storage, googleProvider};