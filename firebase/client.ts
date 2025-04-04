 
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjlVwDc8UZ7g2W9iMvhKPNuYSxFXvoUEs",
  authDomain: "prepviva-8135c.firebaseapp.com",
  projectId: "prepviva-8135c",
  storageBucket: "prepviva-8135c.firebasestorage.app",
  messagingSenderId: "134345359577",
  appId: "1:134345359577:web:610904622df68a3f937ec8",
  measurementId: "G-VWQW83GHM5"
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);