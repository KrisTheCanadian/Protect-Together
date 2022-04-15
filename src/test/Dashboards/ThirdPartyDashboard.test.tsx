/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ThirdPartyDashboard from '../../components/dashboard/ThirdPartyView/ThirdPartyDashboard';

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  DocumentData: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/compat/app', () => {
  const onSnapshot = () => ({
    onSnapshot,
  });
  const Firestore = () => ({
  });

  Firestore.FieldValue = {
    serverTimestamp: jest.fn(),
  };
  const firestore = Firestore;

  const app = jest.requireActual('firebase/compat/app');
  const auth = () => ({
    onAuthStateChanged: () => new Promise<void>((resolve) => resolve()),
  });
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

test('Third Party Dashboard is rendering', () => {
  render(<BrowserRouter><ThirdPartyDashboard setContentId={0} /></BrowserRouter>);
});
