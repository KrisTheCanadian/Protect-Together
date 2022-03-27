/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker } from '@mui/lab';
import { Alert, Button, Grid, Paper, Typography } from '@mui/material';
import { arrayUnion, doc, DocumentData, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

type Props = {
    handleBookingClose: any;
  };

function bookingSystem({ handleBookingClose } : Props) {
  const [appointment, setAppointment] = useState<Date | null>(new Date('2022-01-01 12:00'));
  const [user, setUser] = useState<DocumentData>();
  const { state, update } = React.useContext(UserContext);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addDoctorAppointment = async () => {
    // const assDoc = user.assignedDoctor;
    const users = firestore.collection('users');
    const uid = state.id;
    if (uid === undefined) {
      setError('An error has occured. Please try again later.');
    }
    await users.doc(uid).set({
      appointments: arrayUnion({
        appointment,
        uid,
      }),
    });
  };

  function disableWeekends(date: { getDay: () => number; }) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  return (
    <Grid
      container
      sx={{
        bgcolor: 'primary.contrastText',
        borderRadius: 2,
        boxShadow: 6,
        padding: 6,
        flexDirection: 'column',
        width: '40em',
        maxHeight: '100vh',
        overflow: 'scroll',
      }}
    >
      <Grid
        container
        item
        rowSpacing={1.5}
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Typography variant="h5" mt={3}>
          Book an appointment
        </Typography>
        <Typography variant="subtitle1" mt={1}>
          Please choose an available date and time to meet with your doctor
        </Typography>
        <Grid
          container
          item
          sx={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Paper
            sx={{
              borderRadius: 4,
              bgcolor: 'secondary.main',
              p: 4,
            }}
          >
            <Typography variant="h5">
              {'Dr. '}
              {user?.assignedDoctor ? user?.assignedDoctor : ''}
              {' '}
            </Typography>
            <Grid sx={{ textAlign: 'center' }} mt={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  renderInput={(params) => <TextField {...params} />}
                  label="Book Appointment"
                  value={appointment}
                  onChange={(newValue) => {
                    setAppointment(newValue);
                  }}
                  minDate={new Date()}
                  minTime={new Date(0, 0, 0, 8)}
                  maxTime={new Date(0, 0, 0, 18, 45)}
                  shouldDisableDate={disableWeekends}
                />
              </LocalizationProvider>
            </Grid>
          </Paper>
        </Grid>
        <Grid
          container
          item
          spacing={2}
          sx={{
            flexDirection: 'row',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Grid item xs={6}>
            <Paper
              sx={{
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  handleBookingClose();
                }}
                color="warning"
                fullWidth
                variant="contained"
              >
                Cancel
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  handleBookingClose();
                  addDoctorAppointment();
                }}
                fullWidth
                variant="contained"
              >
                Submit
              </Button>
            </Paper>
          </Grid>
        </Grid>
        {error && <Alert severity="error">{error}</Alert>}
      </Grid>
    </Grid>
  );
};
export default bookingSystem;
