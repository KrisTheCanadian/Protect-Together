/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, fireEvent, render, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../../pages/auth/login';
import '@testing-library/jest-dom';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const firestore = (args : any) => new Promise<void>((resolve) => resolve());
  const auth = () => ({
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: (args : any) => new Promise<void>((resolve) => resolve()),
  });

  const onAuthStateChanged = jest.fn();

  auth.GoogleAuthProvider = jest.fn();

  return {
    __esModule: true,
    ...app,
    default: {
      auth,
      initializeApp: jest.fn(),
      onAuthStateChanged,
      firestore,
    },
  };
});

afterEach(cleanup);

test('Login Renders correctly', async () => {
  const component = render(<BrowserRouter><LoginPage /></BrowserRouter>);
  expect(component.getByText('Welcome')).toBeTruthy();

  const emailInput = component.getByTestId('email');
  expect(emailInput).toBeTruthy();
  await fireEvent.change(emailInput as HTMLInputElement, { target: { value: 'test@test.com' } });
  expect((emailInput as HTMLInputElement).value).toBe('test@test.com');

  const passwordInput = component.getByTestId('password');
  expect(passwordInput).toBeTruthy();
  await userEvent.type(passwordInput, 'test123');
  expect((passwordInput as HTMLInputElement).value).toBe('test123');

  expect(component.getByText('Forgot password?')).toBeTruthy();

  const signInButton = component.getByText('Sign In');
  expect(signInButton).toBeTruthy();

  await waitFor(() => fireEvent.click(signInButton), {
    timeout: 3000,
  });

  expect(component.getByText('Login Failed: Your email or password is incorrect'));
});
