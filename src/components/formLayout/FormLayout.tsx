import * as React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Question1 from './QuestionsDesign/Question1Layout';
import Question2 from './QuestionsDesign/Question2Layout';
import Question3 from './QuestionsDesign/Question3Layout';
import Question5 from './QuestionsDesign/Question5Layout';
import ResponseLayout from './ResponseLayout';

export default function FormLayout(props: any) {
  const [status, setStatus] = React.useState('1');

  const handleCallBack = (childData: any) => {
    setStatus(childData);
  };
  let layout;

  switch (status) {
    case '1':
      layout = <Question1 changeStatus={handleCallBack} />;
      break;
    case '2':
      layout = <Question2 changeStatus={handleCallBack} />;
      break;
    case '3':
      layout = <Question3 changeStatus={handleCallBack} />;
      break;
    case '4':
      layout = <Question5 selection={0} changeStatus={handleCallBack} />;
      break;
    case '5':
      layout = <Question5 selection={1} changeStatus={handleCallBack} />;
      break;
    case '6':
      layout = <Question5 selection={2} changeStatus={handleCallBack} />;
      break;
    case '7':
      layout = <Question5 selection={3} changeStatus={handleCallBack} />;
      break;
    case 'response0':
      layout = <ResponseLayout selection={0} />;
      props.changeStatus('2');
      break;
    case 'response1':
      layout = <ResponseLayout selection={1} />;
      props.changeStatus('2');
      break;
    case 'response2':
      layout = <ResponseLayout selection={2} />;
      props.changeStatus('2');
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
