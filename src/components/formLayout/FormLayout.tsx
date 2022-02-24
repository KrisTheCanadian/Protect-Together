import * as React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Question1 from './QuestionsDesign/Question1Layout';
import Question2 from './QuestionsDesign/Question2Layout';
import Question3 from './QuestionsDesign/Question3Layout';
import Question5 from './QuestionsDesign/Question5Layout';
import ResponseLayout from './ResponseLayout';

export default function SymptomsForm() {
  const [status, setStatus] = React.useState('1');
  const selection = -1;

  const handleCallBack = (childData: any) => {
    setStatus(childData);
  };
  let layout;
  if (status === '1') {
    layout = <Question1 changeStatus={handleCallBack} />;
  }
  if (status === '2') {
    layout = <Question2 changeStatus={handleCallBack} />;
  }
  if (status === '3') {
    layout = <Question3 changeStatus={handleCallBack} />;
  }

  if (status === '4') {
    layout = <Question5 selection={0} changeStatus={handleCallBack} />;
  }
  if (status === '5') {
    layout = <Question5 selection={1} changeStatus={handleCallBack} />;
  }
  if (status === '6') {
    layout = <Question5 selection={2} changeStatus={handleCallBack} />;
  }
  if (status === '7') {
    layout = <Question5 selection={3} changeStatus={handleCallBack} />;
  }

  if (status === 'response0') {
    layout = <ResponseLayout selection={0} />;
  }

  if (status === 'response1') {
    layout = <ResponseLayout selection={1} />;
  }

  if (status === 'response2') {
    layout = <ResponseLayout selection={2} />;
  }

  return (
    <div>
      {layout}
    </div>
  );
}
