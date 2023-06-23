// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {collection,getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1AS2-3UGR6z9kdH4oij4JtBPxcb0jnec",
  authDomain: "zmeet-75fee.firebaseapp.com",
  projectId: "zmeet-75fee",
  storageBucket: "zmeet-75fee.appspot.com",
  messagingSenderId: "832941679836",
  appId: "1:832941679836:web:4fa0c9d018019719b48019",
  measurementId: "G-NQ1YCHLT20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const userRef = collection(firebaseDB,"users");
export const meetingRefs = collection(firebaseDB,"meetings");