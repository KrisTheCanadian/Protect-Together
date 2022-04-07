/* eslint-disable react/no-array-index-key */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useContext, useEffect, useState } from 'react';
import {
  Box, FormControl, Grid, InputLabel, List, ListItem, ListItemText, MenuItem,
  OutlinedInput, Select, SelectChangeEvent, Stack, Typography,
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
        const lastAppointment = new Date(
          user.appointments[user.appointments.length - 1].selectedDate.seconds * 1000,
        );
        const appointmentTime = user.appointments[user.appointments.length - 1].selectedDate;
        const previousAppointments: any = [];
        user.appointments.forEach((x: any) => {
          if (x.selectedDate !== user.appointments[user.appointments.length - 1].selectedDate) {
            previousAppointments.push(new Date(x.selectedDate.seconds * 1000));
          }
        });
        const upcoming = lastAppointment.getTime() > Date.now();
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

  const updatePreviousApp = (index: number) => {
    const { length } = patientData[index].appointmentDates;
    const last = format(patientData[index].appointmentDates[length - 1].selectedDate.seconds * 1000, 'Pp');
    return last;
  };

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
      <Typography
        variant="h5"
        mt={3}
      >
        View Appointments
      </Typography>
      <Typography variant="subtitle1" mt={1}>
        Please choose a patient to see their upcoming and past appointments
      </Typography>
      <Grid sx={{ textAlign: 'center' }} mt={2}>
        <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>Patient</InputLabel>
          <Select
            value={selectedName}
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
          const upApp = p.upcoming ? updatePreviousApp(index) : 'No Upcoming Appointments';
          return (
            <Grid
              container
              key={index}
            >
              <Grid
                container
                item
                xs={6}
              >
                <Typography mt={3}>
                  Upcoming Appointments
                </Typography>
                {upApp}
              </Grid>
              <Grid
                container
                item
                xs={6}
              >
                <Typography mt={3}>
                  Previous Appointments
                </Typography>
                {p.previousAppointments !== null && (
                  <Stack
                    spacing={1}
                    mt={2}
                    display="flex"
                    flexDirection="column"
                    maxHeight="300px"
                    style={{
                      overflow: 'hidden',
                      overflowY: 'scroll',
                    }}
                  >
                    {p.previousAppointments?.map((d: any, key: any) => (
                      <List>
                        <ListItem key={key}>
                          <ListItemText />
                          {format(d, 'Pp')}
                        </ListItem>
                      </List>
                    ))}
                  </Stack>
                )}
              </Grid>
            </Grid>
          );
        }
        return '';
      })}
    </Grid>
  );
}
export default AppointmentView;
