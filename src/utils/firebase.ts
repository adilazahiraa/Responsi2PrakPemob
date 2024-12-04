// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhxApveOTEO9Etqq0T7wJgTjQkmV6aA0M",
  authDomain: "coba-responsi.firebaseapp.com",
  projectId: "coba-responsi",
  storageBucket: "coba-responsi.firebasestorage.app",
  messagingSenderId: "89292312142",
  appId: "1:89292312142:web:9f277c65ce214280e33d1f",
  measurementId: "G-BCXJPB4WJK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(firebase);

export { auth, googleProvider, db};