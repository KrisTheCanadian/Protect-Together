import React, { useState, useEffect } from 'react';
import SymptomsQuestion from './UpdateSymptomsDesign/SymptomsUpdateQuestion';
import SymptomsIntensity from './UpdateSymptomsDesign/IntensityQuestion';
import SymptomsResponse from './UpdateSymptomsDesign/SymptomsUpdateResponse';

import Firebase, { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

export default function UpdateSymptomsLayout({ changeState }: any) {
  const [status, setStatus] = useState('1');
  const [symptomsDone, setSymptomsDone] = useState(false);
  const [points, setPoints] = useState(0);
  // For the Symptoms Update Form
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<string[]>([]);

  let layout;
  const users = firestore.collection('users');
  const { state } = React.useContext(UserContext);

  const updateUserSymptoms = async () => {
    const patientScore = ((points / 66) * 10);
    await users
      .doc(state.id)
      .update({
        score: patientScore,
        patientSymptoms: userSymptoms,
      });
  };

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  useEffect(() => {
    if (symptomsDone) {
      updateUserSymptoms();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptomsDone]);

  const addToSymptoms = (childSymptom: any, symptomsStatus: boolean) => {
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
    if (symptomsStatus) {
      setSymptomsDone(symptomsStatus);
    }
  };

  switch (status) {
    case '1':
      layout = (
        <SymptomsQuestion
          changePoints={handlePoints}
          changeStatus={setStatus}
          changeSymptoms={setSymptomsArray}
          addToSymptoms={addToSymptoms}
        />
      );
      break;
    case '2':
      layout = (
        <SymptomsIntensity
          selection={symptomsArray}
          changeStatus={setStatus}
          changePoints={handlePoints}
          addToSymptoms={addToSymptoms}
        />
      );
      break;
    case 'response':
      layout = <SymptomsResponse />;
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
