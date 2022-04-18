import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { arrayUnion, doc, setDoc, Timestamp } from 'firebase/firestore';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { format } from 'date-fns';
import Firebase, { auth, firestore } from '../../../config/firebase_config';

type Props = {
  handleTestClose: any;
};
function UpdateTestResult({ handleTestClose }: Props) {
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [testType, setTestType] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');
  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (testResult === '' || !testDate || testType === '') {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [testDate, testType, testResult]);

  const addPatientTestResults = () => {
    const uid = auth.currentUser?.uid;
    const user = firestore.collection('users').doc(uid);
    const updatePatient = async () => {
      await user.update({
        testsResults: arrayUnion({
          testResult,
          testType,
          testDate,
        }),
        hasUpdates: true,
      });
    };
    updatePatient().then(() => {
      const fetchData = async () => {
        const patientDataSnapshot = await user.get();
        const patient = patientDataSnapshot.data();
        if (patient) {
          const { assignedDoctor } = patient;
          if (assignedDoctor) {
            const sendNotification = Firebase.functions().httpsCallable('sendNotification');
            sendNotification({
              title: `${patient.firstName} ${patient.lastName} has updated their test results`,
              message: `Tested ${testResult} using ${testType} ${testDate
                ? `on ${format(testDate, 'yyyy-LL-dd')}` : ''}`,
              userId: assignedDoctor,
            });
          }
        }
      };
      fetchData();
    });
  };

  return (
    <Paper
      sx={{
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
    >
      <Grid
        container
        rowSpacing={1.5}
        sx={{
          bgcolor: 'background.default',
          borderRadius: 1,
          boxShadow: 4,
          padding: { xs: 4, sm: 6 },
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Grid item>
          <Paper
            sx={{
              borderRadius: 1,
              bgcolor: 'primary.contrastText',
              p: 4,
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: 18,
                }}
                focused={false}
              >
                Test Date
              </FormLabel>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Select Date"
                  value={testDate}
                  maxDate={new Date()}
                  onChange={(newValue) => {
                    setTestDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      data-testid="cy-date"
                      {...params}
                      sx={{ mr: 2, mt: 1, width: '100%' }}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            sx={{
              borderRadius: 1,
              bgcolor: 'primary.contrastText',
              p: 4,
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: 18,
                }}
                focused={false}
              >
                Test Type
              </FormLabel>
              <RadioGroup
                value={testType}
                onChange={(event) => setTestType(event.target.value)}
              >
                <FormControlLabel
                  value="PCR Test"
                  control={<Radio />}
                  label="PCR Test"
                  sx={{
                    borderRadius: 1,
                    mt: 1,
                  }}
                />
                <FormControlLabel
                  value="Rapid Antigen Test"
                  control={<Radio />}
                  label="Rapid Antigen Test"
                  sx={{
                    borderRadius: 1,
                    pr: 1,
                  }}
                />
                <FormControlLabel
                  value="Antibody Test"
                  control={<Radio />}
                  label="Antibody Test"
                  sx={{
                    borderRadius: 1,
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Paper>
        </Grid>
        <Grid item>
          <Paper
            sx={{
              borderRadius: 1,
              bgcolor: 'primary.contrastText',
              p: 4,
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: 18,
                }}
              >
                Test Result
              </FormLabel>
              <RadioGroup
                value={testResult}
                onChange={(event) => setTestResult(event.target.value)}
              >
                <FormControlLabel
                  value="positive"
                  control={<Radio />}
                  label="Covid-19 Positive"
                  sx={{
                    borderRadius: 4,
                    mt: 1,
                  }}
                />
                <FormControlLabel
                  value="negative"
                  control={<Radio />}
                  label="Covid-19 Negative"
                  sx={{
                    borderRadius: 4,
                    pr: 1,
                  }}
                />
              </RadioGroup>
            </FormControl>
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
          <Grid item>
            <Paper
              sx={{
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  handleTestClose();
                }}
                color="warning"
                fullWidth
                variant="contained"
              >
                Cancel
              </Button>
            </Paper>
          </Grid>
          <Grid item>
            <Paper
              sx={{
                mt: 2,
              }}
            >
              <Button
                type="button"
                onClick={() => {
                  handleTestClose();
                  addPatientTestResults();
                }}
                fullWidth
                variant="contained"
                disabled={status}
              >
                Submit
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default UpdateTestResult;
