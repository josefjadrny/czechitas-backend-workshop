import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANAn9vBfWMX9Jgm2JXNMWggUotRr3R7hk",
  authDomain: "nakupni-seznam-f099f.firebaseapp.com",
  projectId: "nakupni-seznam-f099f",
  storageBucket: "nakupni-seznam-f099f.appspot.com",
  messagingSenderId: "268172371033",
  appId: "1:268172371033:web:0ee6ca3df306d74371bd48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);


