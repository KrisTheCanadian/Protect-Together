/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, findByText, fireEvent, render, waitFor,
} from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import UpdateTestResult from '../components/dashboard/patienttestresult';

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

test('Patient Results Renders correctly', () => {
  const handleTestClose = jest.fn;
  const component = render(<BrowserRouter><UpdateTestResult handleTestClose={handleTestClose} /></BrowserRouter>);
  expect(component.getByText('Cancel')).toBeTruthy();
  expect(component.getByText('Submit')).toBeTruthy();
});
