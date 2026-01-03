import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBK0-9ktTVvlAb7E4s1XHAo7kpnrqvsJIw",
  authDomain: "karatpay-retailers.firebaseapp.com",
  projectId: "karatpay-retailers",
  storageBucket: "karatpay-retailers.firebasestorage.app",
  messagingSenderId: "157158381492",
  appId: "1:157158381492:web:d9d4cfb4e8a7907a43c4e1",
  measurementId: "G-VFKFD1ZF76"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app);

const db = getFirestore(app);

export { app, auth, db };