/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import MedicalDashboard from '../../components/dashboard/MedicalView/MedicalDashboard';
import { UserProvider } from '../../context/UserContext';

jest.mock('firebase/compat/app', () => {
  // mock Firestore
  const Firestore = () => ({
    collection: () => ({
      where: () => ({
        onSnapshot: () => null,
        where: () => ({
          onSnapshot: () => null,
        }),
      }),
      doc: () => ({
        get: () => ({
          then: () => null,
        }),
      }),
    }),
    // to mock attributes
    FieldValue: {
      serverTimestamp: jest.fn(),
    },

  });

  const firestore = Firestore;

  const app = jest.requireActual('firebase/compat/app');

  const auth = () => ({
    onAuthStateChanged: () => {
      jest.fn();
    },
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

jest.mock('firebase/firestore');

afterEach(cleanup);

test('Medical Dashboard Default User Greeting', () => {
  const component = render(
    <BrowserRouter>
      <UserProvider>
        <MedicalDashboard handlePatientClick={undefined} />
      </UserProvider>
    </BrowserRouter>,
  );
  expect(component.getByText('Welcome Dr.')).toBeTruthy();
});

test('Medical Dashboard Renders Test', () => {
  const component = render(<BrowserRouter><MedicalDashboard handlePatientClick={undefined} /></BrowserRouter>);
  expect(component.getByText('Track and manage your patients')).toBeTruthy();
  expect(component.getByText('Name')).toBeTruthy();
  expect(component.getByText('Age')).toBeTruthy();
  expect(component.getByText('Appointment Dates')).toBeTruthy();
  expect(component.getByText('Status')).toBeTruthy();
  expect(component.getByText('Severity')).toBeTruthy();
  expect(component.getByText('Latest Symptoms')).toBeTruthy();
});

test('Medical Dashboard Renders Patients table', () => {
  const component = render(<BrowserRouter><MedicalDashboard handlePatientClick={undefined} /></BrowserRouter>);
  expect(component.getByText('Track and manage your patients')).toBeTruthy();
  expect(component.getByText('Name')).toBeTruthy();
  expect(component.getByText('Age')).toBeTruthy();
  expect(component.getByText('Appointment Dates')).toBeTruthy();
  expect(component.getByText('Status')).toBeTruthy();
  expect(component.getByText('Severity')).toBeTruthy();
  expect(component.getByText('Latest Symptoms')).toBeTruthy();
});
