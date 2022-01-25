import React from 'react';
import '../utils/styles/App.css';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

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

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
