/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../config/firebase_config';
import Dashboard from '../pages/auth/dashboard';
import RegisterPage from '../pages/auth/register';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => jest.fn();
  auth.GoogleAuthProvider = jest.fn();
  auth.signInWithEmailAndPassword = jest.fn();

  return {
    __esModule: true,
    ...app,
    default: {
      auth,
      initializeApp: jest.fn(),
    },
  };
});

afterEach(cleanup);

test('Dashboard is not shown when user is not logged in', () => {
  const { getByText } = render(<BrowserRouter><RegisterPage /></BrowserRouter>);
  expect(getByText('Sign Up')).toBeTruthy();
  expect(getByText('First Name')).toBeTruthy();
  expect(getByText('Last Name')).toBeTruthy();
  expect(getByText('Email Address')).toBeTruthy();
  expect(getByText('Password')).toBeTruthy();
  expect(getByText('Confirm Password')).toBeTruthy();
});
