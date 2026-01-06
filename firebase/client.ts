// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCiNFBcZ4YZ8RzG-zDqIXSSo0y9eYae4Os",
  authDomain: "prepwise-fasi-0p.firebaseapp.com",
  projectId: "prepwise-fasi-0p",
  storageBucket: "prepwise-fasi-0p.firebasestorage.app",
  messagingSenderId: "319499152136",
  appId: "1:319499152136:web:44c96b6abf530f52301abd",
  measurementId: "G-175KSDSHM0"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth=getAuth(app)
export const db=getFirestore(app) 