/* eslint-disable no-promise-executor-return */
import React from 'react';
import { cleanup, findByText, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PatientInfo from '../components/dashboard/MedicalView/PatientInfo';

jest.mock('firebase/compat/app', () => {
  // mock Firestore
  const Firestore = () => ({
    collection: () => ({
      where: () => ({
        onSnapshot: () => null,
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

test('Patient Info Renders correctly', async () => {
  const component = render(<BrowserRouter><PatientInfo PID="123" /></BrowserRouter>);

  const closeButton = component.getByText("Close Patient's File");
  expect(closeButton).toBeTruthy();
  await fireEvent.click(closeButton);

  const priorityButton = component.getByLabelText('Priority');
  expect(priorityButton).toBeTruthy();
  await fireEvent.click(priorityButton);

  const appointmentButton = component.getByText('View Appointments');
  expect(appointmentButton).toBeTruthy();
  await fireEvent.click(appointmentButton);

  expect(component.getByText('Vaccine Info')).toBeTruthy();
  expect(component.getByText('Risk Factors')).toBeTruthy();
  expect(component.getByText('Symptoms')).toBeTruthy();

  const historyButton = component.getByText('History');
  expect(historyButton).toBeTruthy();
  await fireEvent.click(historyButton);
});
