// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMICCnfm9vpErhWXXT7wttKFr_cyPf_FQ",
  authDomain: "authentication-68b36.firebaseapp.com",
  projectId: "authentication-68b36",
  storageBucket: "authentication-68b36.appspot.com",
  messagingSenderId: "325381604038",
  appId: "1:325381604038:web:82aa0a7238ee1ab83c8dc7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firestore
export const db = getFirestore(app);