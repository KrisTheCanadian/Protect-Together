/* eslint-disable no-multi-assign */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRequired from '../../components/auth';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import MedicalView from '../../components/dashboard/MedicalView/MedicalView';
import PatientDashboard from '../../components/dashboard/PatientView/PatientDashboard';
import ThirdPartyDashboard from '../../components/dashboard/ThirdPartyView/ThirdPartyDashboard';
import Dashboard from '../../pages/dashboard/dashboard';

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

jest.mock('firebase/firestore');

afterEach(cleanup);

test('Admin Dashboard is rendering', () => {
  render(<BrowserRouter><AdminDashboard /></BrowserRouter>);
});

test('Thirdparty Dashboard is rendering', () => {
  render(<BrowserRouter><ThirdPartyDashboard /></BrowserRouter>);
});

test('Medical Dashboard is rendering', () => {
  render(<BrowserRouter><MedicalView /></BrowserRouter>);
});

test('Patient Dashboard is rendering', () => {
  render(<BrowserRouter><PatientDashboard setContentId={0} /></BrowserRouter>);
});

test('Dashboard is rendering', () => {
  render(<BrowserRouter><Dashboard /></BrowserRouter>);
});

test('AuthRequired is protecting dashboard correctly', () => {
  jest.mock('../../config/firebase_config');
  const { getByText } = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRequired component={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>,
  );
  expect(getByText('page not found.')).toBeTruthy();
});

test('Dashboard is rendering for patient without errors', () => {
  const state = {
    firstName: 'Foo',
    lastName: 'Bar',
    role: 'patient',
    id: '123',
  };
  render(<Dashboard />);
});

test('Dashboard is rendering for medical without errors', () => {
  const state = {
    firstName: 'Foo',
    lastName: 'Bar',
    role: 'medical',
    id: '123',
  };
  render(<Dashboard />);
});

test('Dashboard is rendering for thirdParty without errors', () => {
  const state = {
    firstName: 'Foo',
    lastName: 'Bar',
    role: 'thirdParty',
    id: '123',
  };
  render(<Dashboard />);
});

test('Dashboard is rendering for admin without errors', () => {
  const state = {
    firstName: 'Foo',
    lastName: 'Bar',
    role: 'admin',
    id: '123',
  };
  render(<Dashboard />);
});
