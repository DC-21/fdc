// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // if you're using Firestore
import { getAuth } from "firebase/auth"; // if you're using Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBRa9j8lRF057-m345UEoMNL865rq5IUFw",
  authDomain: "cps30-b5b4b.firebaseapp.com",
  storageBucket: "cps30-b5b4b.firebasestorage.app",

  project_id: "cps30-b5b4b",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore reference
const auth = getAuth(app); // Auth reference

export { app, db, auth };
