import * as React from 'react';
import Question1 from './QuestionsDesign/Question1Layout';
import Question2 from './QuestionsDesign/Question2Layout';
import Question3 from './QuestionsDesign/Question3Layout';
import Question4 from './QuestionsDesign/Question4Layout';
import Question5 from './QuestionsDesign/Question5Layout';
import ResponseLayout from './ResponseLayout';

export default function FormLayout(props: any) {
  const [status, setStatus] = React.useState('1');
  const [count, setCount] = React.useState(4);
  const [points, setPoints] = React.useState(0);
  const [symptomsArray, setSymptomsArray] = React.useState<number[]>([]);

  const handleCallBack = (childData: any) => {
    setStatus(childData);
  };

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  const handleCount = (childData: any) => {
    setCount(childData);
  };

  const handleSymptoms = (childData: any) => {
    setSymptomsArray(childData);
  };

  const handleParentState = () => {
    props.changeStatus('2');
  };

  let layout;

  switch (status) {
    case '1':
      layout = <Question1 changeStatus={handleCallBack} />;
      break;
    case '2':
      layout = <Question2 changePoints={handlePoints} changeStatus={handleCallBack} />;
      break;
    case '3':
      layout = <Question3 changePoints={handlePoints} changeStatus={handleCallBack} changeSymptoms={handleSymptoms} />;
      break;
    case '4':
      layout = (
        <Question4
          count={count}
          selection={symptomsArray}
          changeStatus={handleCallBack}
          changeCount={handleCount}
          changePoints={handlePoints}
        />
      );
      break;
    case '5':
      layout = (
        <Question5
          count={count}
          changeStatus={handleCallBack}
          changePoints={handlePoints}
        />
      );
      break;
    case 'response0':
      layout = <ResponseLayout selection={0} />;
      handleParentState();
      break;
    case 'response':
      if (points < 15) {
        layout = <ResponseLayout selection={1} />;
      } else {
        layout = <ResponseLayout selection={2} />;
      }
      handleParentState();
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
