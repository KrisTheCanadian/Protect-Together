/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { auth } from '../config/firebase_config';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => jest.fn();
  const firestore = (args : any) => new Promise<void>((resolve) => resolve());
  auth.GoogleAuthProvider = jest.fn();
  auth.signInWithEmailAndPassword = jest.fn();

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

test('AdminCreateAccount Test', () => {
  const component = render(<BrowserRouter><Layout /></BrowserRouter>);
  expect(component.getByText('Welcome Dr. Who')).toBeTruthy();
});
