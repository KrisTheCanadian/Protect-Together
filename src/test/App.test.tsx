/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { fireEvent } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import App from '../components/App';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');

  const auth = () => null;
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

test('App Renders', () => {
  const component = renderer.create(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
});
