/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRequired from '../components/auth';
import { auth } from '../config/firebase_config';
import Dashboard from '../pages/auth/dashboard';

jest.mock('firebase/compat/app', () => {
  const app = jest.requireActual('firebase/compat/app');
  const auth = () => jest.fn();
  auth.GoogleAuthProvider = jest.fn();
  auth.signInWithEmailAndPassword = jest.fn();

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

test('Dashboard is rendering correctly', () => {
  const { getByText } = render(<BrowserRouter><Dashboard /></BrowserRouter>);
  expect(getByText('Dashboard Page.')).toBeTruthy();
});

test('Dashboard is rendering correctly', () => {
  const { getByText } = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRequired component={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>,
  );
  expect(getByText('page not found.')).toBeTruthy();
});
