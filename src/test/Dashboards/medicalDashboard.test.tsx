/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, render } from '@testing-library/react';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MedicalDashboard from '../../components/dashboard/MedicalDashboard/MedicalDashboard';
import { UserProvider } from '../../context/UserContext';

jest.mock('firebase/compat/app', () => {
  const onSnapshot = () => ({
    onSnapshot,
  });
  const where = () => ({
    onSnapshot,
  });
  const collection = () => ({
    where,
  });
  const Firestore = () => ({
    collection,
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

test('Medical Dashboard Default User Greeting', () => {
  const component = render(<BrowserRouter><UserProvider><MedicalDashboard /></UserProvider></BrowserRouter>);
  expect(component.getByText('Welcome Dr.')).toBeTruthy();
});

test('Medical Dashboard Renders Test', () => {
  const component = render(<BrowserRouter><MedicalDashboard /></BrowserRouter>);
  expect(component.getByText('Track and manage your patients')).toBeTruthy();
  expect(component.getByText('Name')).toBeTruthy();
  expect(component.getByText('Age')).toBeTruthy();
  expect(component.getByText('Appointment Dates')).toBeTruthy();
  expect(component.getByText('Symptoms')).toBeTruthy();
});
