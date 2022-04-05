/* eslint-disable no-promise-executor-return */
/* eslint-disable react/react-in-jsx-scope */
import {
  cleanup, fireEvent, queryByAttribute, render,
} from '@testing-library/react';
import { Firestore } from 'firebase/firestore';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import SymptomsUpdateQuestion from '../../components/formLayout/UpdateSymptomsDesign/SymptomsUpdateQuestion';
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

jest.mock('firebase/firestore');
afterEach(cleanup);
test('Option selection renders correctly', async () => {
  const component = render(<BrowserRouter><SymptomsUpdateQuestion handleTestRClose={undefined} /></BrowserRouter>);

  const sympupdate = component.getByTestId('symptom_update');
  expect(sympupdate).toBeTruthy();

  const checkupdate = component.getAllByTestId('checkbox_update');
  expect(checkupdate).toBeTruthy();
});
