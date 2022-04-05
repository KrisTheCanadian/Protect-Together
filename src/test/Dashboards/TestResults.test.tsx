/* eslint-disable no-promise-executor-return */
/* eslint-disable react/react-in-jsx-scope */
import {
  cleanup, fireEvent, queryByAttribute, render,
} from '@testing-library/react';
import { Firestore } from 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import TestResults from '../../components/dashboard/PatientView/TestResults';
// eslint-disable-next-line import/no-extraneous-dependencies

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

const getById = queryByAttribute.bind(null, 'id');
jest.mock('firebase/firestore');
afterEach(cleanup);

test('Register renders correctly', async () => {
  const component = render(<BrowserRouter><TestResults handleTestRClose={undefined} /></BrowserRouter>);
  const results = component.getByTestId('testResult-button');
  expect(results).toBeTruthy();
});
