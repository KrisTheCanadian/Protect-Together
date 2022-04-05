/* eslint-disable no-promise-executor-return */
/* eslint-disable react/react-in-jsx-scope */
import {
  cleanup, fireEvent, queryByAttribute, render,
} from '@testing-library/react';
import { Firestore } from 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import AddMedicalAvailabilities from '../../components/dashboard/AdminDashboard/AdminTable/AddMedicalAvailabilities';
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
test('Medical Availability renders correctly', async () => {
  const component = render(<BrowserRouter><AddMedicalAvailabilities handleTestRClose={undefined} /></BrowserRouter>);
  const avai = component.getAllByText('Save');
  expect(avai).toBeTruthy();
  const Appointments = component.getByText('Appointment Slots');
  expect(Appointments).toBeTruthy();
});
