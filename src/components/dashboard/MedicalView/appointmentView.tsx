/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem,
  OutlinedInput, Select, SelectChangeEvent, Stack, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { UserContext } from '../../../context/UserContext';
import { firestore } from '../../../config/firebase_config';

export interface Data {
  UID: string;
  name: string;
  appointmentDates: any,
  upcoming: boolean;
  previousAppointments: any
}

function AppointmentView() {
  const { state, update } = useContext(UserContext);
  const usersRef = firestore.collection('users').where('assignedDoctor', '==', state.id);
  const [patientData, setPatientData] = useState<Data[]>([]);
  const [patientNames, setPatientNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string>();
  const theme = useTheme();
  const smallSize = useMediaQuery(theme.breakpoints.down('sm'));

  function createTableData(
    UID: string,
    name: string,
    appointmentDates: any,
    upcoming: boolean,
    previousAppointments: any,
  ): Data {
    return {
      UID,
      name,
      appointmentDates,
      upcoming,
      previousAppointments,
    };
  }

  useEffect(() => {
    const unsubscribe = usersRef.onSnapshot(async (snapshot: any) => {
      let appointmentData = new Array<Data>();
      let names = new Array<string>();
      await snapshot.forEach((childSnapshot: any) => {
        const user = childSnapshot.data();
        const { UID } = user;
        const name = [user.firstName, user.lastName].join(' ');
        const { appointments } = user;
        let upcoming = false;
        const previousAppointments: any = [];

        if (user.appointments && user?.appointments.length !== 0) {
          const lastAppointment = new Date(
            user.appointments[user.appointments.length - 1].selectedDate.seconds * 1000,
          );
          upcoming = lastAppointment.getTime() > Date.now();
          if (upcoming) {
            user.appointments.forEach((x: any) => {
              if (x.selectedDate !== user.appointments[user.appointments.length - 1].selectedDate) {
                previousAppointments.push(new Date(x.selectedDate.seconds * 1000));
              }
            });
          } else {
            user.appointments.forEach((x: any) => {
              previousAppointments.push(new Date(x.selectedDate.seconds * 1000));
            });
          }
        }
        const patientEntry = createTableData(UID, name, appointments, upcoming, previousAppointments);
        names = [name, ...names];
        setPatientNames(names);
        appointmentData = [patientEntry, ...appointmentData];
        setPatientData(appointmentData);
      });
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedName(event.target.value as string);
  };

  const getUpcoming = (index: number) => {
    const { length } = patientData[index].appointmentDates;
    const last = format(patientData[index].appointmentDates[length - 1].selectedDate.seconds * 1000, 'Pp');
    return last;
  };

  return (
    <div style={{ overflow: 'auto',
      minWidth: smallSize ? '0' : '35em',
      minHeight: '15em',
      paddingRight: '4px',
      maxHeight: '80vh' }}
    >
      <Typography
        variant="h5"
      >
        View Appointments
      </Typography>
      <Typography variant="subtitle1" mt={1}>
        Please choose a patient to see their upcoming and past appointments
      </Typography>
      <Grid sx={{ textAlign: 'center' }} mt={2}>
        <FormControl sx={{ m: 1, minWidth: smallSize ? '45vw' : 300 }}>
          <InputLabel>Patient</InputLabel>
          <Select
            value={selectedName || ''}
            defaultValue=""
            onChange={handleChange}
            input={<OutlinedInput label="Name" />}
          >
            {patientNames.map((name, index) => (
              <MenuItem
                key={index}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {selectedName && patientData.map((p, index) => {
        if (p.name === selectedName) {
          const upApp = p.upcoming ? getUpcoming(index) : 'No Upcoming Appointments';
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: smallSize ? 'column-reverse' : 'row',
                justifyContent: 'space-around',
              }}
            >
              <Box>
                <Typography mt={3} sx={{ textDecoration: 'underline' }}>
                  Upcoming Appointments
                </Typography>
                <Box mt={1}>
                  {upApp}
                </Box>
              </Box>
              <Box>
                <Typography mt={3} sx={{ textDecoration: 'underline' }}>
                  Previous Appointments
                </Typography>
                {p.previousAppointments.length === 0 && (
                  <Typography mt={1}>
                    No Previous Appointments
                  </Typography>
                )}
                {p.previousAppointments.length !== 0
                  && p.previousAppointments?.map((d: any, key: any) => (
                    <Box mt={1} key={key}>
                      {format(d, 'Pp')}
                    </Box>
                  ))}
              </Box>
            </Box>
          );
        }
        return '';
      })}
    </div>
  );
}
export default AppointmentView;
