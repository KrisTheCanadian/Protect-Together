/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  Grid,
  Typography,
  Button,
  Container,
} from '@mui/material';
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import RemoveIcon from '@mui/icons-material/Remove';

import { doc, onSnapshot } from 'firebase/firestore';
import Firebase, { firestore } from '../../../../config/firebase_config';

export default function AddMedicalAvailabilities({ selectedUser, selectedUserName }: any) {
  const users = firestore.collection('users');
  let availabilitiesArray: any = [];
  const [currentAvailabilities, setCurrentAvailabilities] = useState<any[]>([]);
  const [saved, setSaved] = useState(false);
  const [days, setDays] = useState([
    { label: 'Sun', id: 0, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Mon', id: 1, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Tue', id: 2, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Wed', id: 3, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Thu', id: 4, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Fri', id: 5, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
    { label: 'Sat', id: 6, value: false, sTime: new Date('2020-01-01 9:00'), eTime: new Date('2020-01-01 17:00') },
  ]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${selectedUser}`), (docu) => {
      const data = docu.data();
      if (data) {
        setCurrentAvailabilities(data.availabilities);
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentAvailabilities) {
      currentAvailabilities.forEach((item: any) => {
        days.forEach((day) => {
          if (day.id === item.id) {
            day.value = true;
            day.sTime = new Date(`2020-01-01 ${item.startTime}`);
            day.eTime = new Date(`2020-01-01 ${item.endTime}`);
          }
        });
      });
      setDays([...days]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAvailabilities]);

  const updateAvailabilities = async () => {
    await users
      .doc(selectedUser)
      .update({
        availabilities: availabilitiesArray,
      });
  };

  const save = () => {
    availabilitiesArray = [];
    days.forEach((day) => {
      if (day.value) {
        const startTime = `${day.sTime.getHours()}:${day.sTime.getMinutes()}`;
        const endTime = `${day.eTime.getHours()}:${day.eTime.getMinutes()}`;
        const schedule = { id: day.id, startTime, endTime };
        availabilitiesArray.push(schedule);
      }
    });
    updateAvailabilities();
    setSaved(true);
  };

  return (
    <div style={{ minWidth: '250px', overflowY: 'auto', height: '560px' }}>
      <Typography variant="h5" sx={{ display: 'flex', justifyContent: 'center' }}>
        {selectedUserName}
        {' '}
        Appointment Slots
      </Typography>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        {days.map((day) => (
          <FormGroup sx={{ marginTop: '1rem' }} key={day.label}>
            <Grid container spacing={2}>
              <Grid item xs={4} md={3}>
                <FormControlLabel
                  control={(
                    <Checkbox
                      checked={day.value}
                      onChange={() => {
                        if (!day.value) {
                          day.value = true;
                        } else {
                          day.value = false;
                        }
                        setDays([...days]);
                      }}
                      name={day.label}
                    />
                  )}
                  label={day.label}
                />
              </Grid>
              <Grid item xs={12} md={9} sx={{ display: 'flex', alignItems: 'center' }}>

                <LocalizationProvider data-testid="start" dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="Start"
                    disabled={!day.value}
                    value={day.sTime}
                    onChange={(newValue) => {
                      if (newValue != null) {
                        day.sTime = newValue;
                        setDays([...days]);
                      }
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
                <RemoveIcon />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <TimePicker
                    label="End"
                    disabled={!day.value}
                    value={day.eTime}
                    onChange={(newValue) => {
                      if (newValue != null) {
                        day.eTime = newValue;
                        setDays([...days]);
                      }
                    }}
                    renderInput={(params) => <TextField size="small" {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </FormGroup>
        ))}
      </FormControl>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Button onClick={save} type="submit" variant="contained" color="primary">
          Save
        </Button>
        {saved && (
          <p className="validationError">Your changes have been saved.</p>
        )}
      </div>
    </div>

  );
}
