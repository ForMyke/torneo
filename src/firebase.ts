// src/firebase.ts

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Example: import { getAuth } from "firebase/auth";
// Example: import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDV8YLavoIfQmSrEYFJjwGIKwyDltwEhQ4", // IMPORTANT: Consider using environment variables for sensitive keys
  authDomain: "torneo-9dcd0.firebaseapp.com",
  projectId: "torneo-9dcd0",
  storageBucket: "torneo-9dcd0.appspot.com", // Corrected: usually ends with .appspot.com for storage
  messagingSenderId: "492508736958",
  appId: "1:492508736958:web:b88f692448017ec8555def",
  measurementId: "G-Q90NWMRG77",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Export the Firebase app and services you want to use
export { app, analytics };

// Example: If you want to use Authentication or Firestore
// export const auth = getAuth(app);
// export const db = getFirestore(app);
