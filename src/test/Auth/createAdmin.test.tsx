/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../../config/firebase_config';
import AdminCreateAccount from '../../pages/auth/admincreateaccount';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');

  const auth = () => ({
    onAuthStateChanged: jest.fn(),
    createUserWithEmailAndPassword: (args : any) => new Promise<void>((resolve) => resolve()),
  });
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

test('AdminCreateAccount Test', async () => {
  const component = render(<BrowserRouter><AdminCreateAccount handleClose={undefined} /></BrowserRouter>);
  expect(component.getByText('Create Account')).toBeTruthy();
  expect(component.getByText('Account Type')).toBeTruthy();

  const accountType = component.getByTestId('account-type');
  expect(accountType).toBeTruthy();
  await fireEvent.click(accountType as HTMLOptionElement, { target: { value: 'Admin' } });
  expect((accountType as HTMLOptionElement).value).toBe('Admin');

  const firstNameInput = component.getByTestId('first-name');
  expect(firstNameInput).toBeTruthy();
  await fireEvent.change(firstNameInput as HTMLInputElement, { target: { value: 'First Name' } });
  expect((firstNameInput as HTMLInputElement).value).toBe('First Name');

  const lastNameInput = component.getByTestId('last-name');
  expect(lastNameInput).toBeTruthy();
  await fireEvent.change(lastNameInput as HTMLInputElement, { target: { value: 'Last Name' } });
  expect((lastNameInput as HTMLInputElement).value).toBe('Last Name');

  const emailInput = component.getByTestId('email');
  expect(emailInput).toBeTruthy();
  await fireEvent.change(emailInput as HTMLInputElement, { target: { value: 'test@test.com' } });
  expect((emailInput as HTMLInputElement).value).toBe('test@test.com');

  const phoneInput = component.getByTestId('phone-number');
  expect(phoneInput).toBeTruthy();
  await fireEvent.change(phoneInput as HTMLInputElement, { target: { value: '5143211234' } });
  expect((phoneInput as HTMLInputElement).value).toBe('5143211234');
});
