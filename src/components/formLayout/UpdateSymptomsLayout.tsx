import React, { useState, useEffect } from 'react';
import { arrayUnion } from 'firebase/firestore';
import SymptomsQuestion from './UpdateSymptomsDesign/SymptomsUpdateQuestion';
import SymptomsIntensity from './UpdateSymptomsDesign/SymptomsIntensityQuestion';
import SymptomsResponse from './UpdateSymptomsDesign/SymptomsUpdateResponse';

import Firebase, { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

export default function UpdateSymptomsLayout({ changeState }: any) {
  const [status, setStatus] = useState('1');
  const [symptomsDone, setSymptomsDone] = useState(false);
  const [points, setPoints] = useState(0);
  const [symptomsArray, setSymptomsArray] = useState<number[]>([]);
  const [userSymptoms, setUserSymptoms] = useState<string[]>([]);
  const date = new Date();

  let layout;
  const users = firestore.collection('users');
  const { state } = React.useContext(UserContext);

  const updateUserSymptoms = async () => {
    users
      .doc(state.id).get()
      .then(async (snapshot) => {
        const data = snapshot.data();
        if (data !== undefined) {
          await users
            .doc(state.id)
            .update({
              score: (((data.basePoints + points) / 66) * 10),
              patientSymptoms: arrayUnion({ date, userSymptoms }),
              hasUpdates: true,
            });
        }
      });
  };

  const handlePoints = (childData: any) => {
    setPoints(points + childData);
  };

  useEffect(() => {
    if (symptomsDone) {
      updateUserSymptoms().then(() => {
        const fetchData = async () => {
          const patientDataSnapshot = await users.doc(state.id).get();
          const patient = patientDataSnapshot.data();
          if (patient) {
            const { assignedDoctor } = patient;
            if (assignedDoctor) {
              const sendNotification = Firebase.functions().httpsCallable('sendNotification');
              sendNotification({
                title: `${patient.firstName} ${patient.lastName} has updated their symptoms`,
                message: userSymptoms.join('. '),
                userId: assignedDoctor,
              });
            }
          }
        };
        fetchData();
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symptomsDone]);

  const addToSymptoms = (childSymptom: any, symptomsStatus: boolean) => {
    if (userSymptoms.length === 0) {
      setUserSymptoms(childSymptom);
    } else {
      setUserSymptoms(userSymptoms.concat(childSymptom));
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
