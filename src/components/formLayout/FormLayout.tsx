import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Question1 from './QuestionsDesign/Question1Layout';
import Question2 from './QuestionsDesign/Question2Layout';
import Question3 from './QuestionsDesign/Question3Layout';
import Question4 from './QuestionsDesign/Question4Layout';
import Question5 from './QuestionsDesign/Question5Layout';
import ResponseLayout from './ResponseLayout';

import Firebase, { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

export default function FormLayout({ changeState }: any) {
  const [status, setStatus] = useState('1');
  const [symptomsDone, setSymptomsDone] = useState(false);
  const [count, setCount] = useState(4);
  const [points, setPoints] = useState(0);
  const [symptomsPoints, setSymptomsPoints] = useState(0);
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<string[]>([]);
  const navigate = useNavigate();

  const users = firestore.collection('users');

  const { state } = React.useContext(UserContext);

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  const addToUserAnswer = (childData: any) => {
    setUserAnswers([...userAnswers, childData]);
  };

  useEffect(() => {
    if (symptomsDone) {
      const symptomsAnswer = { label: "Patient's symptoms", result: userSymptoms };
      addToUserAnswer(symptomsAnswer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptomsDone, userSymptoms]);

  const addSymptoms = (childSymptom: any, childPoint: number, symptomsStatus: boolean) => {
    setSymptomsPoints(symptomsPoints + childPoint);
    if (userSymptoms.length === 0) {
      if (Array.isArray(childSymptom)) {
        setUserSymptoms(childSymptom);
      } else {
        const tempSymptomsArray = [childSymptom];
        setUserSymptoms(tempSymptomsArray);
      }
    } else {
      setUserSymptoms([...userSymptoms, childSymptom]);
    }
    setSymptomsDone(symptomsStatus);
  };

  const requestDoctor = async () => {
    let patientScore = 0;

    if (status === 'response 0') {
      patientScore = 10;
    } else {
      patientScore = ((points / 66) * 10);
    }

    await users
      .doc(state.id)
      .update({
        score: patientScore,
        basePoints: points - symptomsPoints,
        assignedDoctor: 'requestedDoctor',
        initialPatientHelpFormData: userAnswers,
      })
      .then(() => {
        const getDoctor = Firebase.functions().httpsCallable('requestDoctor');
        getDoctor();
        navigate('/dashboard');
      });
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
          addSymptoms={addSymptoms}
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
          addSymptoms={addSymptoms}
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
      layout = <ResponseLayout selection={0} requestDoctor={requestDoctor} />;
      setTimeout(() => changeState('2'), 0);
      break;
    case 'response':
      if (points < 15) {
        layout = <ResponseLayout selection={1} requestDoctor={requestDoctor} />;
      } else {
        layout = <ResponseLayout selection={2} requestDoctor={requestDoctor} />;
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
