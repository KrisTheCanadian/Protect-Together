/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DateTimePicker, DatePicker } from '@mui/lab';
import { Alert, Button, Grid, Paper, Typography, Stack, Modal } from '@mui/material';
import { arrayUnion, doc, DocumentData, onSnapshot, setDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import Header from '../../components/layout/Header';

type Props = {
    handleBookingClose: any;
  };

function bookingSystem(this: any, { handleBookingClose } : Props) {
  const [appointment, setAppointment] = useState<Date | null>(new Date('2022-01-01 12:00'));
  const [user, setUser] = useState<DocumentData>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date('2022-01-01 12:00'));
  const [error, setError] = useState<string>('');
  const [booked, setBooked] = useState<boolean>(false);
  const { state } = React.useContext(UserContext);
  const users = firestore.collection('users');
  const doctor = user?.assignedDoctor;
  const docName = user?.doctorName;

  const date1 = new Date('2022-05-02 02:15');
  const date2 = new Date('2022-07-01 02:15');
  const date3 = new Date('2022-06-15 03:55');
  const times = [date1, date2, date3, date2];
  const bookedDates = [date1, date2];
  const bookedTimes: number[] = [];

  const checkAppoint = (data : Date | null) => {
    if (data === null) {
      setError('Please select a date');
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const appoint of bookedDates) {
        if (appoint.getDate() === data?.getDate()
        && appoint.getMonth() === data?.getMonth() && appoint.getFullYear() === data?.getFullYear()) {
          bookedTimes.push(appoint.getTime());
        }
      }
    }
  };

  const makeButton = (data : Date) => {
    if (bookedTimes.length === 0 || !(bookedTimes.includes(data.getTime()))) {
      console.log('looks good');
        <Button variant="contained">
          {data.getHours()}
          {' : '}
          {data.getMinutes()}
        </Button>;
    }
  };

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

  const addDoctorAppointment = async () => {
    if (user !== undefined) {
      users
        .doc(state.id).get()
        .then(async (snapshot) => {
          const data = snapshot.data();
          if (data !== undefined) {
            await users
              .doc(state.id)
              .update({
                appointments: arrayUnion({ appointment }),
              });
          }
        });
    }
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
              {docName}
              {' '}
            </Typography>
            <Grid sx={{ textAlign: 'center' }} mt={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {/* <DateTimePicker
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
                /> */}
                <DatePicker
                  disablePast
                  value={selectedDate}
                  label="Date"
                  openTo="day"
                  views={['year', 'month', 'day']}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    // checkAppoint(selectedDate);
                    // setOpen(true);
                    console.log('here');
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
              {/* <Modal open={open}> */}
              <Stack spacing={2}>
                {times.map(makeButton, this)}
              </Stack>
              {/* </Modal> */}
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
