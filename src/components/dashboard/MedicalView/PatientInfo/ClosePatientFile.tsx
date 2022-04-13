import React, { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, useTheme, useMediaQuery, Modal } from '@mui/material';
import { doc, DocumentData, onSnapshot, deleteField } from 'firebase/firestore';
import { UserContext } from '../../../../context/UserContext';
import Firebase, { firestore } from '../../../../config/firebase_config';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #ff003d',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  p: 4,
  borderRadius: 4,
};

export default function PatientAppointments({ PID, handleClose, goDashboard }: any) {
  const [patientName, setPatientName] = useState('');
  const users = firestore.collection('users');

  useEffect(() => {
    console.log(PID);
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${PID}`), (docu) => {
      const data = docu.data();
      if (data) {
        const name = [data.firstName, data.lastName].join(' ');
        setPatientName(name);
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteUpcomingAppointment = () => {
    console.log('here');
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${PID}`), (docu) => {
      const data = docu.data();
      if (data) {
        if (data.appointments && data.appointments.length) {
          const appointmentData = data?.appointments[data.appointments.length - 1]?.selectedDate;
          const appointmentTime = appointmentData?.toDate();
          const currentDate = new Date();
          if (appointmentTime > currentDate) {
            const userId = PID;
            const appointmentDate = appointmentTime;
            const cancelAppointment = Firebase.functions().httpsCallable('cancelAppointment');
            cancelAppointment({ appointmentDate, userId }).catch((saveError) => {
              console.error(saveError);
            });
          }
        }
      }
    });
    return () => {
      unsubscribe();
    };
  };

  const updatePatient = async () => {
    console.log('here');
    await users
      .doc(PID)
      .update({
        score: deleteField(),
        basePoints: deleteField(),
        assignedDoctor: deleteField(),
        doctorName: deleteField(),
      });
  };

  const closePatient = () => {
    deleteUpcomingAppointment();
    handleClose();
    goDashboard();
    // updatePatient();
  };

  return (
    <Box sx={{ ...style, width: '500px' }}>
      <Typography variant="h6" sx={{ alignItems: 'center', textAlign: 'center' }}>
        Are you sure you to discharge
        {' '}
        {patientName}
        {' '}
        and close this patient&apos;s file?
      </Typography>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box mt={2}>
          <Button
            onClick={handleClose}
            type="submit"
            variant="contained"
            color="secondary"
            style={{ width: '200px' }}
          >
            Keep Patient&apos;s File
          </Button>
        </Box>
        <Box mt={2}>
          <Button
            onClick={closePatient}
            type="submit"
            variant="contained"
            color="warning"
            style={{ width: '200px' }}
          >
            Close Patient&apos;s File
          </Button>
        </Box>
      </div>
    </Box>
  );
}
