/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { Alert, Button, Grid, Paper, Typography, Stack } from '@mui/material';
import { arrayUnion, doc, DocumentData, onSnapshot, setDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';

type Props = {
    handleBookingClose: any;
  };

function bookingSystem({ handleBookingClose } : Props) {
  const [user, setUser] = useState<DocumentData>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointmentDate, setAppointmenDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { state } = React.useContext(UserContext);
  const users = firestore.collection('users');
  const doctor = user?.assignedDoctor;
  const docName = user?.doctorName;

  const date1 = new Date('2022-05-02 5:15');
  const date2 = new Date('2022-07-01 2:15');
  const date3 = new Date('2022-06-15 3:55');

  const setTimes = ['1:00', '2:00', '3:00', '3:55', '4:00', '5:15'];
  const bookedDates = [date1, date2, date3];
  const bookedTimes: string[] = [];
  const [updatedTimes, setUpdatedTimes] = useState<string[]>(setTimes);

  const updateTimes = () => {
    setUpdatedTimes(setTimes.filter((n) => !bookedTimes.includes(n)));
  };

  const checkTOD = () => (parseInt(selectedTime.split(':')[0], 10) < 12 ? 'am' : 'pm');

  const checkAppoint = (date : Date) => {
    setSelectedDate(date);
    if (date === null) {
      setError('Please select a date');
    } else {
      // eslint-disable-next-line no-restricted-syntax
      for (const appoint of bookedDates) {
        if (appoint.getDate() === date?.getDate()
        && appoint.getMonth() === date?.getMonth() && appoint.getFullYear() === date?.getFullYear()) {
          bookedTimes.push(`${appoint.getHours()}:${appoint.getMinutes()}`);
        }
      }
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
                appointments: arrayUnion({ selectedDate: appointmentDate }),
              });
          }
        });
    }
  };

  useEffect(() => {
    if (appointmentDate !== null) {
      addDoctorAppointment();
      handleBookingClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentDate]);

  const createAppointment = () => {
    if (selectedDate === null || selectedDate === undefined) {
      setError('Please select a date');
    } else if (selectedTime === '' || selectedTime === null) {
      setError('Please select a time');
    } else {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const date = selectedDate.getDate();
      const hour = parseInt(selectedTime.split(':')[0], 10);
      const minute = parseInt(selectedTime.split(':')[1], 10);
      setAppointmenDate(new Date(year, month, date, hour, minute));
    }
  };

  const disableWeekends = (date: { getDay: () => number; }) => date.getDay() === 0 || date.getDay() === 6;

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
              mb: 3,
            }}
          >
            <Typography variant="h5">
              {'Dr. '}
              {docName}
              {' '}
            </Typography>
            <Grid sx={{ textAlign: 'center' }} mt={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  disablePast
                  value={selectedDate}
                  label="Date"
                  openTo="day"
                  views={['year', 'month', 'day']}
                  onChange={(newValue) => {
                    if (newValue) {
                      checkAppoint(newValue);
                    }
                    updateTimes();
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={new Date()}
                  shouldDisableDate={disableWeekends}
                />
              </LocalizationProvider>
              <Stack spacing={2} mt={2}>
                {updatedTimes.map((d) => (
                  <Button
                    variant="contained"
                    key={d}
                    onClick={() => setSelectedTime(d)}
                  >
                    {d}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Paper>
        </Grid>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          {selectedDate?.toDateString()}
          {' '}
          {selectedTime === '' ? '' : 'at '}
          {' '}
          {selectedTime}
          {selectedTime === '' ? ' ' : checkTOD() }
        </Typography>
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
          <Grid item xs={6} mb={2}>
            <Paper
              sx={{
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  createAppointment();
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
