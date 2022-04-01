import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import PateintTimeline from '../components/dashboard/MedicalView/PatientInfo/PatientTimeline';

test('PateintTimeLine is rendering date and time', () => {
  const events = [
    {
      date: new Timestamp(1648788807, 0),
      eventsList: [],
    },
  ];
  const expected = format(events[0].date.toDate(), 'yyyy-LL-dd KK:mm:ss a');
  const component = render(
    <BrowserRouter>
      <PateintTimeline events={events} />
    </BrowserRouter>,
  );
  expect(component.getByText(expected)).toBeTruthy();
});

test('PateintTimeLine is rendering a single event text', () => {
  const events = [
    {
      date: new Timestamp(1648788807, 0),
      eventsList: ['some event'],
    },
  ];
  const component = render(
    <BrowserRouter>
      <PateintTimeline events={events} />
    </BrowserRouter>,
  );
  expect(component.getByText('some event')).toBeTruthy();
});

test('PateintTimeLine is rendering a multiple events text', () => {
  const events = [
    {
      date: new Timestamp(1648788807, 0),
      eventsList: ['some event1', 'another event2', 'a third event3'],
    },
  ];
  const component = render(
    <BrowserRouter>
      <PateintTimeline events={events} />
    </BrowserRouter>,
  );
  events[0].eventsList.forEach((item) => expect(component.getByText(item)).toBeTruthy());
});

test('PateintTimeLine is rendering a multiple events', () => {
  const events = [
    {
      date: new Timestamp(1648788807, 0),
      eventsList: ['some event1', 'another event1', 'a third event1'],
    },
    {
      date: new Timestamp(486584100, 0),
      eventsList: ['some event2', 'another event2', 'a third event2'],
    },
    {
      date: new Timestamp(648788807, 0),
      eventsList: ['some event3', 'another event3', 'a third event3'],
    },
  ];
  const component = render(
    <BrowserRouter>
      <PateintTimeline events={events} />
    </BrowserRouter>,
  );
  events.forEach((event) => {
    const expected = format(event.date.toDate(), 'yyyy-LL-dd KK:mm:ss a');
    expect(component.getByText(expected)).toBeTruthy();
    event.eventsList.forEach((item) => expect(component.getByText(item)).toBeTruthy());
  });
});
