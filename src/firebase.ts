// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeVvXlncpAE4jQHJ57iRPfkCw_-NXcMYs",
  authDomain: "torneo-4083b.firebaseapp.com",
  projectId: "torneo-4083b",
  storageBucket: "torneo-4083b.firebasestorage.app",
  messagingSenderId: "1055848948709",
  appId: "1:1055848948709:web:f5c094cd0a85116b24450c",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firebase app and services
export { app, db };
