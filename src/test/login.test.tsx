/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, findByText, fireEvent, getByText, render, waitFor,
} from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../config/firebase_config';
import LoginPage from '../pages/auth/login';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => ({
    signInWithEmailAndPassword: () => new Promise<void>((resolve) => resolve()),
  });
  auth.GoogleAuthProvider = jest.fn();

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

test('Login Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><LoginPage /></BrowserRouter>);
  expect(getByText('Sign in')).toBeTruthy();
  expect(getByText('Email Address')).toBeTruthy();
  expect(getByText('Password')).toBeTruthy();
  expect(getByText('Forgot password?')).toBeTruthy();
});

test('Login requires email and password for sign', async () => {
  const { getByText } = render(<BrowserRouter><LoginPage /></BrowserRouter>);

  const c = await waitFor(() => fireEvent.click(getByText('Sign In')), {
    timeout: 3000,
  });
  expect(getByText('Sign in')).toBeTruthy();
});
