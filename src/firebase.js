import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2kmR5BFVrK3CsoEmd-H2RoSaQbjyf0v4",
  authDomain: "gym-tracker-f0816.firebaseapp.com",
  projectId: "gym-tracker-f0816",
  storageBucket: "gym-tracker-f0816.firebasestorage.app",
  messagingSenderId: "722105303689",
  appId: "1:722105303689:web:e9e00109b3cd041df07c58",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
