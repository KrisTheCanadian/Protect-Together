import React, { useState } from 'react';
import SymptomsQuestion from './SymptomsUpdating';
import SymptomsIntensity from './SymptomsIntensity';

export default function FormLayout({ changeState }: any) {
  const [status, setStatus] = useState('1');
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);
  let layout;

  switch (status) {
    case '1':
      layout = <SymptomsQuestion changeStatus={setStatus} changeSymptoms={setSymptomsArray} />;
      break;
    case '2':
      layout = <SymptomsIntensity changeStatus={setStatus} selection={symptomsArray} />;
      break;
    default:
      layout = '';
  }

  return (
    <div>
      {layout}
    </div>
  );
}
