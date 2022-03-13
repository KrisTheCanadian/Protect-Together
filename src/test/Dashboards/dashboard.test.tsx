/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AuthRequired from '../../components/auth';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import MedicalView from '../../components/dashboard/MedicalView/MedicalView';
import PatientDashboard from '../../components/dashboard/PatientDashboard';
import ThirdPartyDashboard from '../../components/dashboard/ThirdPartyDashboard';
import Dashboard from '../../pages/dashboard/dashboard';

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
  render(<BrowserRouter><PatientDashboard /></BrowserRouter>);
});

test('Dashboard is rendering', () => {
  render(<BrowserRouter><Dashboard /></BrowserRouter>);
});

test('AuthRequired is protecting dashboard correctly', () => {
  const { getByText } = render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRequired component={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>,
  );
  expect(getByText('page not found.')).toBeTruthy();
});
