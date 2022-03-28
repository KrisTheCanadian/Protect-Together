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
  Typography,
  TextField,
} from '@mui/material';
import { arrayUnion, doc, setDoc, Timestamp } from 'firebase/firestore';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { auth, firestore } from '../../../config/firebase_config';

type Props = {
  handleTestClose: any;
};
function UpdateTestResult({ handleTestClose }: Props) {
  const [error, setError] = useState<string>('');
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
    user.update({
      testsResults: arrayUnion({
        testResult,
        testType,
        testDate,
      }),
    });
  };

  return (
    <Grid
      container
      sx={{
        bgcolor: 'background.default',
        borderRadius: 1,
        boxShadow: 4,
        padding: 6,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        width: '90%',
        m: '5%',
        maxHeight: '95vh',
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
          bgcolor: 'background.default',
        }}
      >
        <Grid
          item
          sx={{
            width: '100%',
          }}
        >
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
                  onChange={(newValue) => {
                    setTestDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} sx={{ mr: 2, mt: 1, width: '100%' }} required />}
                />
              </LocalizationProvider>
            </FormControl>
          </Paper>
        </Grid>
        <Grid
          item
          sx={{
            width: '100%',
          }}
        >
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
                  value="PCRTest"
                  control={<Radio />}
                  label="PCR Test"
                  sx={{
                    borderRadius: 1,
                    mt: 1,
                  }}
                />
                <FormControlLabel
                  value="rapidAntigenTest"
                  control={<Radio />}
                  label="Rapid Antigen Test"
                  sx={{
                    borderRadius: 1,
                    pr: 1,
                  }}
                />
                <FormControlLabel
                  value="antibodyTest"
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
        <Grid
          item
          sx={{
            width: '100%',
          }}
        >
          <Paper
            sx={{
              borderRadius: 1,
              bgcolor: 'primary.contrastText',
              p: 4,
              mb: 2,
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
      </Grid>

    </Grid>
  );
}

export default UpdateTestResult;
