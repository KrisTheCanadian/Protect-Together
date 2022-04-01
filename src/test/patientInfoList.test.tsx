import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PateintInfoList from '../components/dashboard/MedicalView/PatientInfo/PatientInfoList';

test('PateintInfoList is rendering title', () => {
  const component = render(
    <BrowserRouter>
      <PateintInfoList listTitle="List Title" listItems={undefined} />
    </BrowserRouter>,
  );
  expect(component.getByText('List Title')).toBeTruthy();
});

test('PateintInfoList is rendering primary element in list', () => {
  const items = [{
    primary: 'primary element',
    secondary: '',
  }];
  const component = render(
    <BrowserRouter>
      <PateintInfoList listTitle="List Title" listItems={items} />
    </BrowserRouter>,
  );
  expect(component.getByText('primary element')).toBeTruthy();
});

test('PateintInfoList is rendering secondary element in list', () => {
  const items = [{
    primary: '',
    secondary: 'secondary element',
  }];
  const component = render(
    <BrowserRouter>
      <PateintInfoList listTitle="List Title" listItems={items} />
    </BrowserRouter>,
  );
  expect(component.getByText('secondary element')).toBeTruthy();
});

test('PateintInfoList is rendering primary and secondary element in list', () => {
  const items = [{
    primary: 'primary element',
    secondary: 'secondary element',
  }];
  const component = render(
    <BrowserRouter>
      <PateintInfoList listTitle="List Title" listItems={items} />
    </BrowserRouter>,
  );
  expect(component.getByText('primary element')).toBeTruthy();
  expect(component.getByText('secondary element')).toBeTruthy();
});

test('PateintInfoList is rendering multiple elements in list', () => {
  const items = [
    {
      primary: 'primary element1',
      secondary: 'secondary element1',
    },
    {
      primary: 'primary element2',
      secondary: 'secondary element2',
    },
    {
      primary: 'primary element3',
      secondary: 'secondary element3',
    },
  ];
  const component = render(
    <BrowserRouter>
      <PateintInfoList listTitle="List Title" listItems={items} />
    </BrowserRouter>,
  );
  expect(component.getByText('primary element1')).toBeTruthy();
  expect(component.getByText('primary element2')).toBeTruthy();
  expect(component.getByText('primary element3')).toBeTruthy();
  expect(component.getByText('secondary element1')).toBeTruthy();
  expect(component.getByText('secondary element2')).toBeTruthy();
  expect(component.getByText('secondary element3')).toBeTruthy();
});
