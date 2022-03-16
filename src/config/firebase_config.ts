import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';

// Web App's Firebase Configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD0r8VtI_bEtw0h92MwWdSpOPw37SpoVMY',
  authDomain: 'soen-390-ba781.firebaseapp.com',
  projectId: 'soen-390-ba781',
  storageBucket: 'soen-390-ba781.appspot.com',
  messagingSenderId: '524325710222',
  appId: '1:524325710222:web:6e38b0f6e3a5bf50371cdf',
  measurementId: 'G-FBCJFVK0VQ',
};

// Initialize Firebase
const Firebase = firebase.initializeApp(firebaseConfig);

export const createUserFirebase = firebase.initializeApp(firebaseConfig, 'Secondary');
export const Providers = {
  google: new firebase.auth.GoogleAuthProvider(),
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export default Firebase;
