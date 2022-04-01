/* eslint-disable no-promise-executor-return */
import React from 'react';
import { cleanup, findByText, fireEvent, render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PatientInfo from '../components/dashboard/MedicalView/PatientInfo/PatientInfo';

jest.mock('firebase/compat/app', () => {
  // mock Firestore
  const Firestore = () => ({
    doc: () => ({
      get: () => ({
        then: () => null,
      }),
    }),
    collection: () => ({

      where: () => ({
        onSnapshot: () => null,
        where: () => ({
          onSnapshot: () => null,
        }),
      }),
      doc: () => ({
        onSnapshot: () => null,
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

jest.mock('firebase/firestore');

afterEach(cleanup);

test('Patient Info Renders correctly', async () => {
  window.HTMLElement.prototype.scrollIntoView = () => null;
  const component = render(<BrowserRouter><PatientInfo PID="123" /></BrowserRouter>);

  expect(component.getByText("Patient's Info")).toBeTruthy();
  expect(component.getByText('Latest Symptoms')).toBeTruthy();

  const historyButton = component.getByText('History');
  expect(historyButton).toBeTruthy();
  await fireEvent.click(historyButton);
});
