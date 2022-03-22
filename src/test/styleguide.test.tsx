/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, fireEvent, queryByAttribute, render,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import StyleGuide from '../components/layout/StyleGuide';

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

test('Style Guide renders correctly', async () => {
  const component = render(<BrowserRouter><StyleGuide /></BrowserRouter>);
  expect(component.getByText('Style Guide')).toBeTruthy();
});
