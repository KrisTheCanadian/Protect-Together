import { Button, TextField, Typography } from '@mui/material';
import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import { firestore } from '../../../../config/firebase_config';

type Props = {
  handleClose: any;
  selectedUser: string;
};

export const EditUser = ({ handleClose, selectedUser }: Props) => {
  const [patientSlots, setPatientSlots] = useState<string>('');

  const [user, setUser] = useState<DocumentData>();
  // get selected user doc
  const userRef = firestore.collection('/users').doc(selectedUser);

  const handleSubmit = () => {
    let availableSlots = 0;
    let oldPatientSlots = 0;
    const newPatientSlots = parseInt(patientSlots, 10);
    if (user) {
      availableSlots = user.availableSlots;
      oldPatientSlots = user.patientSlots;
    }
    // adjust available slots
    if (oldPatientSlots < newPatientSlots) {
      availableSlots += newPatientSlots - oldPatientSlots;
    } else if (oldPatientSlots > newPatientSlots) {
      availableSlots -= oldPatientSlots - newPatientSlots;
      if (availableSlots < 0) {
        availableSlots = 0;
      }
    }
    userRef.update({ patientSlots: parseInt(patientSlots, 10), availableSlots });
    // also must handle reassignment of patients here
    handleClose();
  };

  useEffect(() => {
    const getUser = () => {
      userRef.get().then((doc) => {
        const userData = doc.data();
        setUser(userData);
        if (userData && userData.patientSlots) {
          setPatientSlots(userData.patientSlots.toString());
        } else {
          setPatientSlots('0');
        }
      });
    };
    getUser();

    return () => {
      setUser({}); // to cleanup state
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Typography
        variant="h4"
        component="div"
        gutterBottom
      >
        {user ? `Dr. ${user.firstName} ${user.lastName}` : <>&nbsp;</>}

      </Typography>
      <TextField
        label="Patient Slots"
        value={patientSlots}
        onChange={(event) => {
          const parsedInt = parseInt(event.target.value, 10);

          if (parsedInt >= 0 || event.target.value === '') {
            setPatientSlots(event.target.value.toString());
          }
        }}
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        onClick={handleSubmit}
        sx={{ mt: 3, mb: 2 }}
      >
        Save
      </Button>

    </>
  );
};
