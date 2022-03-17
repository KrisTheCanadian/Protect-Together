/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import ForgotPassword from '../../pages/auth/forgot';
import '@testing-library/jest-dom';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => ({
    onAuthStateChanged: jest.fn(),
    sendPasswordResetEmail: (args : any) => new Promise<void>((resolve) => resolve()),
  });
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

test('Forgot Renders correctly', async () => {
  const component = render(<BrowserRouter><ForgotPassword /></BrowserRouter>);
  expect(component.getByText('Forgot Email')).toBeTruthy();

  const emailInput = component.getByTestId('email');
  expect(emailInput).toBeTruthy();
  fireEvent.change(emailInput as HTMLInputElement, { target: { value: 'test@test.com' } });
  expect((emailInput as HTMLInputElement).value).toBe('test@test.com');

  expect(component.getByText('Sign in')).toBeTruthy();
  expect(component.getByText('Don\'t have an account? Sign Up')).toBeTruthy();

  const sendButton = component.getByText('Send');
  expect(sendButton).toBeTruthy();
  const c = await waitFor(() => fireEvent.click(sendButton), {
    timeout: 3000,
  });
});
