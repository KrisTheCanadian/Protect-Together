import React, { useEffect, useState } from 'react';
import { Typography, Box, Button } from '@mui/material';
import { doc, onSnapshot } from 'firebase/firestore';
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

export default function ClosePatientFile({ PID, handleClose, goDashboard }: any) {
  const [patientName, setPatientName] = useState('');
  const [error, setError] = useState(false);
  let hasNextAppointment = false;
  const users = firestore.collection('users');

  useEffect(() => {
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

  const updatePatient = async () => {
    if (!hasNextAppointment) {
      const closePatientFile = Firebase.functions().httpsCallable('closePatientFile ');
      const userId = PID;
      closePatientFile({ userId });
      handleClose();
      goDashboard(0);
    };
  };

  const canDoctorDelete = () => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${PID}`), (docu) => {
      const data = docu.data();
      if (data) {
        if (data.appointments && data.appointments.length) {
          const appointmentData = data?.appointments[data.appointments.length - 1]?.selectedDate;
          const appointmentTime = appointmentData?.toDate();
          const currentDate = new Date();
          if (appointmentTime > currentDate) {
            setError(true);
            hasNextAppointment = true;
          }
        }
      }
      // calls Update Patient after going through validation checks
      updatePatient();
    });
    return () => {
      unsubscribe();
    };
  };

  const closePatient = async () => {
    canDoctorDelete();
  };

  return (
    <Box sx={{ ...style }}>
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
        {error && (
          <p className="validationError" style={{ marginTop: '1rem', alignItems: 'center', textAlign: 'center' }}>
            {patientName}
            {' '}
            has upcoming appointment scheduled with you.
            Unable to close this patient&apos;s file until appointment is completed.
          </p>
        )}
      </div>
    </Box>
  );
}
