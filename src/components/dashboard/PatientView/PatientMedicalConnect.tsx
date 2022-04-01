/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-unresolved
import '../../../static/style/CovidData.css';
import {
  Button,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import { UserContext } from '../../../context/UserContext';
import { firestore } from '../../../config/firebase_config';
import theme from '../../../static/style/theme';
import Chat from '../../chat';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: 0,
  },
  boxShadow: 0,
  margin: 0,
  p: 4,
};

function PatientMedicalConnect() {
  const navigate = useNavigate();
  const { state } = React.useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title={`Chat with Dr. ${user?.doctorName}`}>
        <Button variant="contained" color="primary" onClick={() => { navigate('/symptomsUpdate'); }}>
          Update Your Symptoms
        </Button>
      </Header>
      <MainContent>
        <Chat
          patientID={state.id}
          recipientID={user?.assignedDoctor}
          recipientFirstName="D"
          recipientLastName={user?.doctorName}
        />
      </MainContent>
    </Box>
  );
}
export default PatientMedicalConnect;
