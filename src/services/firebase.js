import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhzY1QtkKY-AdyF4lGixUyToHqyvS_jTE",
  authDomain: "attendance-platform-8e58a.firebaseapp.com",
  projectId: "attendance-platform-8e58a",
  storageBucket: "attendance-platform-8e58a.firebasestorage.app",
  messagingSenderId: "1012816351013",
  appId: "1:1012816351013:web:f6d43280c766699e6714cc",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
