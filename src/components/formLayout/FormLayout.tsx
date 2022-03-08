import React, { useState } from 'react';
import Question1 from './QuestionsDesign/Question1Layout';
import Question2 from './QuestionsDesign/Question2Layout';
import Question3 from './QuestionsDesign/Question3Layout';
import Question4 from './QuestionsDesign/Question4Layout';
import Question5 from './QuestionsDesign/Question5Layout';
import ResponseLayout from './ResponseLayout';

export default function FormLayout({ changeState }: any) {
  const [status, setStatus] = useState('1');
  const [count, setCount] = useState(4);
  const [points, setPoints] = useState(0);
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  let layout;

  switch (status) {
    case '1':
      layout = (
        <Question1
          changeStatus={setStatus}
        />
      );
      break;
    case '2':
      layout = <Question2 changePoints={handlePoints} changeStatus={setStatus} />;
      break;
    case '3':
      layout = <Question3 changePoints={handlePoints} changeStatus={setStatus} changeSymptoms={setSymptomsArray} />;
      break;
    case '4':
      layout = (
        <Question4
          count={count}
          selection={symptomsArray}
          changeStatus={setStatus}
          changeCount={setCount}
          changePoints={handlePoints}
        />
      );
      break;
    case '5':
      layout = (
        <Question5
          count={count}
          changeStatus={setStatus}
          changePoints={handlePoints}
        />
      );
      break;
    case 'response0':
      layout = <ResponseLayout selection={0} />;
      setTimeout(() => changeState('2'), 0);
      break;
    case 'response':
      if (points < 15) {
        layout = <ResponseLayout selection={1} />;
      } else {
        layout = <ResponseLayout selection={2} />;
      }
      setTimeout(() => changeState('2'), 0);
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
