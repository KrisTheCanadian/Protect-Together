/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PatientDashboard from '../../components/dashboard/PatientView/PatientDashboard';

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

test('Patient Dashboard is rendering', () => {
  render(<BrowserRouter><PatientDashboard setContentId={0} /></BrowserRouter>);
});

test('Add Covid-19 Test is rendering', async () => {
  const component = render(<BrowserRouter><PatientDashboard setContentId={0} /></BrowserRouter>);
  const covidButton = component.getAllByTestId('covidtest2');
  expect(covidButton).toBeTruthy();
  const TestResults = component.getAllByTestId('TestResults');
  expect(TestResults).toBeTruthy();
});

test('Ask for Help is rendering', async () => {
  const component = render(<BrowserRouter><PatientDashboard setContentId={0} /></BrowserRouter>);
  const helpButton = component.getByText('Ask for Help');
  expect(helpButton).toBeTruthy();
  await fireEvent.click(helpButton);
});
