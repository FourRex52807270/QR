// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7Wg64JULbGHw-aUJEA3cQfJqZH0mZlzo",
  authDomain: "thrashcredit.firebaseapp.com",
  projectId: "thrashcredit",
  storageBucket: "thrashcredit.firebasestorage.app",
  messagingSenderId: "577350138726",
  appId: "1:577350138726:web:4da35f386239bd070a66a7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);