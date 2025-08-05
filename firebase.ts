// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Exporta os serviços que vamos usar no resto do app
export const auth = getAuth(app);
export const database = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();