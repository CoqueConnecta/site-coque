import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgaQTy2jYKbfu9aoQl-d--EMO-FRhnQj8",
  authDomain: "site-coque.firebaseapp.com",
  databaseURL: "https://site-coque-default-rtdb.firebaseio.com",
  projectId: "site-coque",
  storageBucket: "site-coque.firebasestorage.app",
  messagingSenderId: "754360342619",
  appId: "1:754360342619:web:586d5f8bb290e8fe3f077e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();