/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, findByText, fireEvent, render, waitFor,
} from '@testing-library/react';
import firebase from 'firebase/compat';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import DrawerSymptoms from '../components/formLayout/DrawerSymptoms';
import FormLayout from '../components/formLayout/FormLayout';
import HeaderSymptoms from '../components/formLayout/HeaderSymptoms';
import Question1Layout from '../components/formLayout/QuestionsDesign/Question1Layout';
import Question2Layout from '../components/formLayout/QuestionsDesign/Question2Layout';
import Question3Layout from '../components/formLayout/QuestionsDesign/Question3Layout';
import Question4Layout from '../components/formLayout/QuestionsDesign/Question4Layout';
import Question5Layout from '../components/formLayout/QuestionsDesign/Question5Layout';
import ResponseLayout from '../components/formLayout/ResponseLayout';
import SymptomsForm from '../pages/symptomsForm/SymptomsForm';

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
    onAuthStateChanged: jest.fn(),
    signInWithEmailAndPassword: (args : any) => new Promise<void>((resolve) => resolve()),
  });

  const onAuthStateChanged = jest.fn();

  auth.GoogleAuthProvider = jest.fn();

  return {
    __esModule: true,
    ...app,
    default: {
      auth,
      initializeApp: jest.fn(),
      onAuthStateChanged,
      firestore,
    },
  };
});

afterEach(cleanup);

test('Question 1 Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><Question1Layout /></BrowserRouter>);
  expect(getByText('Question 1')).toBeTruthy();
});

test('Question 2 Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><Question2Layout /></BrowserRouter>);
  expect(getByText('Question 2')).toBeTruthy();
});

test('Question 3 Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><Question3Layout /></BrowserRouter>);
  expect(getByText('Question 3')).toBeTruthy();
});

test('Question 4 Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><Question4Layout selection="0" /></BrowserRouter>);
  expect(getByText('Question')).toBeTruthy();
});

test('Question 5 Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><Question5Layout /></BrowserRouter>);
  expect(getByText('Question')).toBeTruthy();
});

test('Covid-19 Assessment Test Renders correctly', () => {
  const { getByText } = render(<BrowserRouter><DrawerSymptoms /></BrowserRouter>);
  expect(getByText('Covid-19 Assessment Test')).toBeTruthy();
});

test('FormLayout Renders correctly', () => {
  render(<BrowserRouter><FormLayout /></BrowserRouter>);
});

test('Header Renders correctly', () => {
  render(<BrowserRouter><HeaderSymptoms /></BrowserRouter>);
});

test('Response Layout Renders correctly', () => {
  render(<BrowserRouter><ResponseLayout /></BrowserRouter>);
});

test('SymptomsForm Renders correctly', () => {
  render(<BrowserRouter><SymptomsForm /></BrowserRouter>);
});
