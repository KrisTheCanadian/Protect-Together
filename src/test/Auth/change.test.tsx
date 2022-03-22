/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { fireEvent, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import ChangePassword from '../../pages/auth/change';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');

  const auth = () => jest.fn();
  auth.GoogleAuthProvider = jest.fn();
  auth.currentUser = jest.fn();
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

test('Change Password Renders', async () => {
  const component = render(<BrowserRouter><ChangePassword /></BrowserRouter>);
  expect(component.getByText('Change Password')).toBeTruthy();

  const newPasswordInput = component.getByTestId('new-password');
  expect(newPasswordInput).toBeTruthy();
  userEvent.type(newPasswordInput, 'test123');
  expect((newPasswordInput as HTMLInputElement).value).toBe('test123');

  const confirmPasswordInput = component.getByTestId('confirm-password');
  expect(confirmPasswordInput).toBeTruthy();
  userEvent.type(confirmPasswordInput, 'test123');
  expect((confirmPasswordInput as HTMLInputElement).value).toBe('test123');

  const oldPasswordInput = component.getByTestId('old-password');
  expect(oldPasswordInput).toBeTruthy();
  userEvent.type(oldPasswordInput, 'test123');
  expect((oldPasswordInput as HTMLInputElement).value).toBe('test123');

  const signInButton = component.getByText('Sign In');
  await waitFor(() => fireEvent.click(signInButton), {
    timeout: 3000,
  });
});
