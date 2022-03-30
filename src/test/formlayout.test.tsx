/* eslint-disable max-len */
/* eslint-disable no-promise-executor-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable global-require */
import {
  cleanup, findByText, fireEvent, render, waitFor, screen,
} from '@testing-library/react';
import firebase from 'firebase/compat';
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DrawerSymptoms from '../components/formLayout/DrawerSymptoms';
import FormLayout from '../components/formLayout/FormLayout';
import HeaderSymptoms from '../components/formLayout/HeaderSymptoms';
import Question1Layout from '../components/formLayout/QuestionsDesign/Question1Layout';
import Question2Layout from '../components/formLayout/QuestionsDesign/Question2Layout';
import Question3Layout from '../components/formLayout/QuestionsDesign/Question3Layout';
import Question5Layout from '../components/formLayout/QuestionsDesign/Question5Layout';
import ResponseLayout from '../components/formLayout/ResponseLayout';
import SymptomsForm from '../pages/symptomsForm/SymptomsForm';

jest.mock('firebase/firestore', () => ({
  __esModule: true,
  ...jest.requireActual('firebase/firestore'),
  doc: jest.fn(),
  DocumentData: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/compat/app', () => {
  // mock Firestore
  const Firestore = () => ({
    collection: () => ({
      where: () => ({
        onSnapshot: () => jest.fn(),
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
  render(<BrowserRouter><Question1Layout /></BrowserRouter>);
  expect(screen.getByText('Question 1')).toBeTruthy();
});

test('Question 2 Renders correctly', () => {
  render(<BrowserRouter><Question2Layout /></BrowserRouter>);
  expect(screen.getByText('Question 2')).toBeTruthy();
});

test('Question 2 Renders I have been in contact with a person who has COVID-19 Option Correctly', async () => {
  render(<BrowserRouter><Question2Layout /></BrowserRouter>);
  const question2 = screen.getByText('Question 2');
  const covid19Option = screen.getByText('I have been in contact with a person who has COVID-19.');

  await waitFor(() => {
    expect(question2).toBeInTheDocument();
    expect(covid19Option).toBeInTheDocument();
  });

  fireEvent.click(covid19Option);

  expect(question2).toBeTruthy();
});

test('Question 2 Renders I have tested positive for COVID-19 Option Correctly', async () => {
  render(<BrowserRouter><Question2Layout /></BrowserRouter>);

  const question2 = screen.getByText('Question 2');
  const positiveCovid19Option = screen.getByText('I have tested positive for COVID-19');

  await waitFor(() => {
    expect(question2).toBeInTheDocument();
    expect(positiveCovid19Option).toBeInTheDocument();
  });

  fireEvent.click(positiveCovid19Option);

  expect(question2).toBeTruthy();
});

test('Question 2 Renders I have one or more symptoms of COVID-19 Option Correctly', async () => {
  render(<BrowserRouter><Question2Layout /></BrowserRouter>);

  const question2 = screen.getByText('Question 2');
  const moreSymptomsOfCovid19Option = screen.getByText('I have one or more symptoms of COVID-19.');

  await waitFor(() => {
    expect(question2).toBeInTheDocument();
    expect(moreSymptomsOfCovid19Option).toBeInTheDocument();
  });
  fireEvent.click(moreSymptomsOfCovid19Option);

  expect(question2).toBeTruthy();
});

test('Question 3 Renders correctly', async () => {
  render(<BrowserRouter><Question3Layout /></BrowserRouter>);
  const question3 = screen.getByText('Question 3');

  await waitFor(() => {
    expect(question3).toBeInTheDocument();
  });
  expect(question3).toBeTruthy();
});

test('Question 3 Renders One Option', async () => {
  render(<BrowserRouter><Question3Layout /></BrowserRouter>);
  const question3 = screen.getByText('Question 3');
  const FeverOption = screen.getByText('Fever and/or chills');

  await waitFor(() => {
    expect(question3).toBeInTheDocument();
    expect(FeverOption).toBeInTheDocument();
  });

  fireEvent.click(screen.getByText('Fever and/or chills'));

  expect(question3).toBeTruthy();
});

test('Question 3 Renders Two Option', async () => {
  render(<BrowserRouter><Question3Layout /></BrowserRouter>);
  const question3 = screen.getByText('Question 3');
  const FeverOption = screen.getByText('Fever and/or chills');
  const CoughOption = screen.getByText('Cough');

  await waitFor(() => {
    expect(question3).toBeInTheDocument();
    expect(FeverOption).toBeInTheDocument();
    expect(CoughOption).toBeInTheDocument();
  });
  fireEvent.click(FeverOption);
  fireEvent.click(CoughOption);
  expect(question3).toBeTruthy();
});

test('Question 3 Renders Three Option', async () => {
  render(<BrowserRouter><Question3Layout /></BrowserRouter>);

  const question3 = screen.getByText('Question 3');
  const FeverOption = screen.getByText('Fever and/or chills');
  const CoughOption = screen.getByText('Cough');
  const ShortBreathOption = screen.getByText('Shortness of breath');

  await waitFor(() => {
    expect(question3).toBeInTheDocument();
    expect(FeverOption).toBeInTheDocument();
    expect(CoughOption).toBeInTheDocument();
    expect(ShortBreathOption).toBeInTheDocument();
  });

  expect(question3).toBeTruthy();

  await waitFor(() => fireEvent.click(FeverOption));
  await waitFor(() => fireEvent.click(CoughOption));
  await waitFor(() => fireEvent.click(ShortBreathOption));

  expect(question3).toBeTruthy();
});

test('Question 3 Renders Four Option', async () => {
  render(<BrowserRouter><Question3Layout /></BrowserRouter>);

  const question3 = screen.getByText('Question 3');
  const FeverOption = screen.getByText('Fever and/or chills');
  const CoughOption = screen.getByText('Cough');
  const ShortBreathOption = screen.getByText('Shortness of breath');
  const SoreThroatOption = screen.getByText('Sore throat');

  await waitFor(() => {
    expect(question3).toBeInTheDocument();
    expect(FeverOption).toBeInTheDocument();
    expect(CoughOption).toBeInTheDocument();
    expect(ShortBreathOption).toBeInTheDocument();
    expect(SoreThroatOption).toBeInTheDocument();
  });

  expect(question3).toBeTruthy();
  await waitFor(() => fireEvent.click(FeverOption));
  await waitFor(() => fireEvent.click(CoughOption));
  await waitFor(() => fireEvent.click(ShortBreathOption));
  await waitFor(() => fireEvent.click(SoreThroatOption));
  expect(question3).toBeTruthy();
});

test('Question FormLayout Renders correctly', async () => {
  render(<BrowserRouter><FormLayout /></BrowserRouter>);
  const question1 = screen.getByText('Question 1');
  const Q1NoOption = screen.getByText('No');
  const Q1ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(question1).toBeInTheDocument();
    expect(Q1NoOption).toBeInTheDocument();
    expect(Q1ContinueOption).toBeInTheDocument();
  });

  expect(question1).toBeTruthy();

  await waitFor(() => fireEvent.click(Q1NoOption));
  await waitFor(() => fireEvent.click(Q1ContinueOption));

  const Q2 = screen.getByText('Question 2');
  const Q2OneOrMoreSymptomsOption = screen.getByText('I have one or more symptoms of COVID-19.');
  const Q2ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q2OneOrMoreSymptomsOption).toBeInTheDocument();
    expect(Q2ContinueOption).toBeInTheDocument();
    expect(Q2).toBeInTheDocument();
  });
  expect(Q2).toBeTruthy();

  await waitFor(() => fireEvent.click(Q2OneOrMoreSymptomsOption));
  await waitFor(() => fireEvent.click(Q2ContinueOption));

  const Q3 = screen.getByText('Question 3');
  const Q3ShortnessBreathOption = screen.getByText('Shortness of breath');
  const Q3ContinueOption = screen.getByText('Continue');
  await waitFor(() => {
    expect(Q3ShortnessBreathOption).toBeInTheDocument();
    expect(Q3ContinueOption).toBeInTheDocument();
    expect(Q3).toBeInTheDocument();
  });

  expect(Q3).toBeTruthy();
  await waitFor(() => fireEvent.click(Q3ShortnessBreathOption));
  await waitFor(() => fireEvent.click(Q3ContinueOption));

  const Q4 = screen.getByText('Question 4');
  const Q4SevereOption = screen.getByText('Severe');
  const Q4ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q4SevereOption).toBeInTheDocument();
    expect(Q4ContinueOption).toBeInTheDocument();
    expect(Q4).toBeInTheDocument();
  });

  expect(Q4).toBeTruthy();

  await waitFor(() => fireEvent.click(Q4SevereOption));
  await waitFor(() => fireEvent.click(Q4ContinueOption));
});

test('Question 5 Renders correctly', async () => {
  render(<BrowserRouter><Question5Layout /></BrowserRouter>);
  const Question = screen.getByText('Question');
  await waitFor(() => {
    expect(Question).toBeInTheDocument();
  });
  expect(Question).toBeTruthy();
});

test('Covid-19 Assessment Test Renders correctly', () => {
  render(<BrowserRouter><DrawerSymptoms /></BrowserRouter>);
  const BackHomeButton = screen.getByText('Back to Home');
  expect(BackHomeButton).toBeTruthy();
  fireEvent.click(BackHomeButton);
});

test('FormLayout Renders correctly for every question', async () => {
  render(<BrowserRouter><FormLayout changeState={jest.fn()} /></BrowserRouter>);

  const Q1 = screen.getByText('Question 1');
  const Q1NoOption = screen.getByText('No');
  const Q1ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q1).toBeInTheDocument();
    expect(Q1NoOption).toBeInTheDocument();
    expect(Q1ContinueOption).toBeInTheDocument();
  });

  expect(Q1).toBeTruthy();
  await waitFor(() => fireEvent.click(Q1NoOption));
  await waitFor(() => fireEvent.click(Q1ContinueOption));

  const Q2 = screen.getByText('Question 2');
  const Q2MoreThanOneSymptomsOption = screen.getByText('I have one or more symptoms of COVID-19.');
  const Q2ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q2).toBeInTheDocument();
    expect(Q2MoreThanOneSymptomsOption).toBeInTheDocument();
    expect(Q2ContinueOption).toBeInTheDocument();
  });

  expect(Q2).toBeTruthy();
  await waitFor(() => fireEvent.click(Q2MoreThanOneSymptomsOption));
  await waitFor(() => fireEvent.click(Q2ContinueOption));

  const Q3 = screen.getByText('Question 3');
  const Q3NoneOption = screen.getByText('None of the above');
  const Q3ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q3).toBeInTheDocument();
    expect(Q3NoneOption).toBeInTheDocument();
    expect(Q3ContinueOption).toBeInTheDocument();
  });

  expect(Q3).toBeTruthy();
  await waitFor(() => fireEvent.click(Q3NoneOption));
  await waitFor(() => fireEvent.click(Q3ContinueOption));

  const Q4 = screen.getByText('Question 4');
  const Q4NoOption = screen.getByText('No');
  const Q4ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q4).toBeInTheDocument();
    expect(Q4NoOption).toBeInTheDocument();
    expect(Q4ContinueOption).toBeInTheDocument();
  });

  expect(Q4).toBeTruthy();
  await waitFor(() => fireEvent.click(Q4NoOption));
  await waitFor(() => fireEvent.click(Q4ContinueOption));

  const Q5 = screen.getByText('Question 5');
  const Q5YesOption = screen.getByText('Yes');
  const Q5ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q5).toBeInTheDocument();
    expect(Q5YesOption).toBeInTheDocument();
    expect(Q5ContinueOption).toBeInTheDocument();
  });

  expect(Q5).toBeTruthy();
  await waitFor(() => fireEvent.click(Q5YesOption));
  await waitFor(() => fireEvent.click(Q5ContinueOption));

  const Q6 = screen.getByText('Question 6');
  const Q6NoOption = screen.getByText('No');
  const Q6ContinueOption = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q6).toBeInTheDocument();
    expect(Q6NoOption).toBeInTheDocument();
    expect(Q6ContinueOption).toBeInTheDocument();
  });

  expect(Q6).toBeTruthy();
  await waitFor(() => fireEvent.click(Q6NoOption));
  await waitFor(() => fireEvent.click(Q6ContinueOption));

  const monitorYourSymptoms = screen.getByText('Monitor your symptoms.');

  await waitFor(() => {
    expect(monitorYourSymptoms).toBeInTheDocument();
  });

  expect(monitorYourSymptoms).toBeTruthy();
});

test('FormLayout Sends you to an Emergency Hotline', async () => {
  render(<BrowserRouter><FormLayout changeState={jest.fn()} /></BrowserRouter>);

  const Q1 = screen.getByText('Question 1');
  const Q1YesOption = screen.getByText('Yes');
  const Q1Continue = screen.getByText('Continue');

  await waitFor(() => {
    expect(Q1).toBeInTheDocument();
    expect(Q1YesOption).toBeInTheDocument();
    expect(Q1Continue).toBeInTheDocument();
  });

  expect(Q1).toBeTruthy();
  fireEvent.click(Q1YesOption);
  await waitFor(() => fireEvent.click(Q1Continue));

  const help911 = screen.getByText('Please call 9-1-1 or go directly to your nearest emergency department.');
  await waitFor(() => {
    expect(help911).toBeInTheDocument();
  });

  expect(help911).toBeTruthy();
});

test('Header Renders correctly', async () => {
  render(<BrowserRouter><HeaderSymptoms /></BrowserRouter>);
  await waitFor(() => fireEvent.click(screen.getByText('Back to Home')));
});

test('Response Layout Renders correctly', () => {
  render(<BrowserRouter><ResponseLayout /></BrowserRouter>);
});

test('SymptomsForm Renders correctly', () => {
  render(<BrowserRouter><SymptomsForm /></BrowserRouter>);
});
