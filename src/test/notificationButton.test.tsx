/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import { cleanup, fireEvent, render } from '@testing-library/react';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import NotificationButton from '../components/layout/NotificationsButton';
import { UserProvider } from '../context/UserContext';

const mockData = {
  notifications: [
    {
      title: 'notification title',
      message: 'notification message',
      date: new Timestamp(1648792293, 0),
      read: false,
    },
  ],
};

jest.mock('firebase/compat/app', () => {
  // mock Firestore
  const Firestore = () => ({
    collection: () => ({
      where: () => ({
        onSnapshot: () => mockData,
        where: () => ({
          onSnapshot: () => null,
        }),
      }),
      doc: () => ({
        get: () => ({
          then: () => null,
        }),
      }),
      onSnapshot: () => ({
        data: () => mockData,
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

test('Medical View Default User Greeting', () => {
  const component = render(<BrowserRouter><UserProvider><NotificationButton /></UserProvider></BrowserRouter>);
  const notificationsButton = component.getAllByRole('button');
  expect(notificationsButton).toBeTruthy();
});
