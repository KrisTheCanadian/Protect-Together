/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { fireEvent } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import App from '../components/App';
import ChangePassword from '../pages/auth/change';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');

  const auth = () => jest.fn();
  auth.GoogleAuthProvider = jest.fn();
  auth.currentUser = jest.fn();

  return {
    __esModule: true,
    ...app,
    default: {
      auth,
      initializeApp: jest.fn(),
    },
  };
});

test('Change Password Renders', () => {
  const component = renderer.create(
    <BrowserRouter>
      <ChangePassword />
    </BrowserRouter>,
  );
});
