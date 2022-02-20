/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { fireEvent } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import App from '../components/App';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const firestore = (args : any) => new Promise<void>((resolve) => resolve());
  const auth = () => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: (args : any) => new Promise<void>((resolve) => resolve()),
  });
  auth.GoogleAuthProvider = jest.fn();

  return {
    __esModule: true,
    ...app,
    default: {
      auth,
      initializeApp: jest.fn(),
      firestore,
    },
  };
});

test('App Renders', () => {
  const component = renderer.create(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
});
