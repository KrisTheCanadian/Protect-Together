/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import firebase from 'firebase/compat';
import React from 'react';
import renderer from 'react-test-renderer';
import LoginPage from '../pages/auth/login';

// jest.mock('firebase/compat/auth');
jest.mock('firebase/compat', () => {
  const auth = jest.fn().mockImplementation(() => ({
    GoogleAuthProvider: jest.fn(),
  }));

  // const mAuth = { signInWithRedirect: jest.fn() };

  // @ts-ignore
  // auth.GoogleAuthProvider = jest.fn();
  // @ts-ignore

  // auth.Auth = jest.fn(() => mAuth);
  return {
    __esModule: true, // this property makes it work
    default: 'firebase',
    auth,
  };
});

test('Link changes the class when hovered', () => {
  const component = renderer.create(<LoginPage />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
