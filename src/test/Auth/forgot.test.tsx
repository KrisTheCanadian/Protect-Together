/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import ForgotPassword from '../../pages/auth/forgot';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => jest.fn();
  auth.GoogleAuthProvider = jest.fn();
  auth.signInWithEmailAndPassword = jest.fn();
  const firestore = (args : any) => new Promise<void>((resolve) => resolve());

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

afterEach(cleanup);

test('Forgot Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><ForgotPassword /></BrowserRouter>);
  expect(getByText('Forgot Email')).toBeTruthy();
  expect(getByText('Sign in')).toBeTruthy();
  expect(getByText('Don\'t have an account? Sign Up')).toBeTruthy();
  expect(getByText('Send')).toBeTruthy();
});
