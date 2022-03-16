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
  const [priorityPoints, setPriorityPoints] = useState(0);
  // For the Symptoms Update Form
  const [symptomsPoints, setSymptomsPoints] = useState(0);
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);
  // Array that has all user answers (useful for next sprint)
  const [userAnswer, setUserAnswer] = useState<string[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<string[]>([]);

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  const addToUserAnswer = (childData: any) => {
    setUserAnswer([...userAnswer, childData]);
  };

  const addToSymptoms = (childSymptom: any, childPoint: number) => {
    setSymptomsPoints(symptomsPoints + childPoint);
    if (userSymptoms.length === 0) {
      setUserSymptoms(childSymptom);
    } else {
      setUserSymptoms([...userSymptoms, childSymptom]);
    }
  };

  const addSymptomsToUserAnswer = () => {
    const symptomsAnswer = { label: "Patient's symptoms", result: userSymptoms };
    handlePoints(symptomsPoints);
    addToUserAnswer(symptomsAnswer);
  };

  const sendToDatabase = () => {
    if (status === 'response 0') {
      setPriorityPoints(10);
    } else {
      setPriorityPoints((points / 66) * 10);
    }
    // SEND User answer
  };
  let layout;

  switch (status) {
    case '1':
      layout = <Question1 changeStatus={setStatus} addUserAnswer={addToUserAnswer} />;
      break;
    case '2':
      layout = <Question2 changePoints={handlePoints} changeStatus={setStatus} addUserAnswer={addToUserAnswer} />;
      break;
    case '3':
      layout = (
        <Question3
          changePoints={handlePoints}
          changeStatus={setStatus}
          changeSymptoms={setSymptomsArray}
          addUserAnswer={addToSymptoms}
        />
      );
      break;
    case '4':
      layout = (
        <Question4
          count={count}
          selection={symptomsArray}
          changeStatus={setStatus}
          changeCount={setCount}
          changePoints={handlePoints}
          addUserAnswer={addToSymptoms}
          addSymptoms={addSymptomsToUserAnswer}
        />
      );
      break;
    case '5':
      layout = (
        <Question5
          count={count}
          changeStatus={setStatus}
          changePoints={handlePoints}
          addUserAnswer={addToUserAnswer}
        />
      );

      break;
    case 'response0':
      layout = <ResponseLayout selection={0} sendUserInfo={sendToDatabase} />;
      setTimeout(() => changeState('2'), 0);
      break;
    case 'response':
      if (points < 15) {
        layout = <ResponseLayout selection={1} sendUserInfo={sendToDatabase} />;
      } else {
        layout = <ResponseLayout selection={2} sendUserInfo={sendToDatabase} />;
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
