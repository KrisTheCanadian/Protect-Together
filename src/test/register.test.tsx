/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, fireEvent, queryByAttribute, render,
} from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { auth } from '../config/firebase_config';
import RegisterPage from '../pages/auth/register';

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

const getById = queryByAttribute.bind(null, 'id');

afterEach(cleanup);

test('Dashboard Test', async () => {
  const component = render(<BrowserRouter><RegisterPage /></BrowserRouter>);
  expect(component.getByText('Getting Started')).toBeTruthy();
  expect(component.getByText('Already have an account? Sign in')).toBeTruthy();
  expect(component.getByText('First Name')).toBeTruthy();
  expect(component.getByText('Last Name')).toBeTruthy();
  expect(component.getByText('Email Address')).toBeTruthy();
  expect(component.getByText('Password')).toBeTruthy();
  expect(component.getByText('Confirm Password')).toBeTruthy();

  const button = getById(component.container, 'next-1');
  fireEvent.click(button as HTMLElement);

  expect(component.getByText('Health Information')).toBeTruthy();
  expect(component.getByText('Date of Birth *')).toBeTruthy();
  expect(component.getByLabelText('Weight')).toBeTruthy();
  expect(component.getByText('Height *')).toBeTruthy();
  expect(component.getByText('Sex')).toBeTruthy();
  expect(component.getByText('Health Card Number *')).toBeTruthy();
  expect(component.getByLabelText('Medical Conditions')).toBeTruthy();
  expect(component.getByLabelText('Additional Notes')).toBeTruthy();
  expect(component.getByText('I accept the privacy policy')).toBeTruthy();
});
