/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker } from '@mui/lab';
import { Alert, Button, Grid, Paper, Typography, Stack } from '@mui/material';
import { arrayUnion, doc, DocumentData, onSnapshot } from 'firebase/firestore';
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

  const date1 = new Date('2022-05-02 17:00');
  const date2 = new Date('2022-07-01 14:00');
  const date3 = new Date('2022-06-15 12:30');
  // This is a temporary schedule.
  const schedule = [{ id: 1, startTime: '9:0', endTime: '17:0' },
    { id: 2, startTime: '9:0', endTime: '17:0' },
    { id: 3, startTime: '9:0', endTime: '17:0' },
    { id: 4, startTime: '9:0', endTime: '17:0' },
    { id: 5, startTime: '9:0', endTime: '17:0' }];

  const disabledDays = [0, 1, 2, 3, 4, 5, 6];
  schedule.forEach((day: any) => {
    disabledDays.splice(disabledDays.indexOf(day.id), 1);
  });

  const setTimes: any[] = [];
  const bookedDates = [date1, date2, date3];
  const bookedTimes: string[] = [];
  const [updatedTimes, setUpdatedTimes] = useState<string[]>(setTimes);

  const setAppointmentTimes = (day : number) => {
    schedule.forEach((d: any) => {
      if (d.id === day) {
        const dateStart = new Date();
        const startHour = parseInt(d.startTime.split(':')[0], 10);
        const startMinute = parseInt(d.startTime.split(':')[1], 10);
        dateStart.setHours(startHour);
        dateStart.setMinutes(startMinute);

        const dateEnd = new Date();
        const endHour = parseInt(d.endTime.split(':')[0], 10);
        const endMinute = parseInt(d.endTime.split(':')[1], 10);
        dateEnd.setHours(endHour);
        dateEnd.setMinutes(endMinute);

        while (dateStart <= dateEnd) {
          const hour = dateStart.getHours();
          let minute = `${dateStart.getMinutes()}`;
          if (minute === '0') {
            minute = '00';
          }
          const min = dateStart.getMinutes();
          setTimes.push(`${hour}:${min}`);
          dateStart.setMinutes(dateStart.getMinutes() + 30);
        };
      };
    });
  };

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
    if (appointmentDate !== null || selectedDate === undefined) {
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

  const disabledDay = (date: { getDay: () => number; }) => (
    disabledDays.includes(0) && date.getDay() === 0) || (disabledDays.includes(1) && date.getDay() === 1)
    || (disabledDays.includes(2) && date.getDay() === 2) || (disabledDays.includes(3) && date.getDay() === 3)
    || (disabledDays.includes(4) && date.getDay() === 4) || (disabledDays.includes(5) && date.getDay() === 5)
    || (disabledDays.includes(6) && date.getDay() === 6);

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
                      setAppointmentTimes(newValue.getDay());
                    }
                    updateTimes();
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  minDate={new Date()}
                  shouldDisableDate={disabledDay}
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
