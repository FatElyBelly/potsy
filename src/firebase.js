import firebase from "firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
} from "firebase/firestore";

const app = firebase.initializeApp({
    apiKey: "AIzaSyAqkOQshp5GUvKCrAUvRzLGsJUpzX4SRoU",
    authDomain: "chat-523ad.firebaseapp.com",
    projectId: "chat-523ad",
    storageBucket: "chat-523ad.appspot.com",
    messagingSenderId: "369960539173",
    appId: "1:369960539173:web:1a6ae3a2959ebe1a38dbcc",
    measurementId: "G-FLCE6MT2D8"
})
const db = firebase.firestore()
const auth = firebase.auth()

export {auth, db}