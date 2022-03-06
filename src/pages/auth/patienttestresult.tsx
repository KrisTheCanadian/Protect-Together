import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Alert,
  TextField,
} from '@mui/material';
import useId from '@mui/material/utils/useId';
import { arrayUnion, doc, setDoc, Timestamp } from 'firebase/firestore';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { auth, firestore } from '../../config/firebase_config';

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
      console.log('Invalid Inputs');
    } else {
      // console.log('im goood');
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
      xs={12}
      sx={{
        bgcolor: 'primary.contrastText',
        borderRadius: 2,
        boxShadow: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Grid
        item
        xs={4}
        sx={{
          borderRadius: 4,
          bgcolor: 'secondary.main',
          p: 4,
          mb: 2,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Select Test Date"
            value={testDate}
            onChange={(newValue) => {
              setTestDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} sx={{ mr: 2 }} required />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          borderRadius: 4,
          bgcolor: 'secondary.main',
          p: 5,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Which test did you take?
        </Typography>
        <FormControl>
          <RadioGroup
            value={testType}
            onChange={(event) => setTestType(event.target.value)}
          >
            <FormControlLabel
              value="PCRTest"
              control={<Radio />}
              label="PCR Test"
              sx={{
                borderRadius: 4,
                bgcolor: 'primary.contrastText',
                mb: 2,
              }}
            />
            <FormControlLabel
              value="rapidAntigenTest"
              control={<Radio />}
              label="Rapid Antigen Test"
              sx={{
                borderRadius: 4,
                bgcolor: 'primary.contrastText',
                mb: 2,
                pr: 1,
              }}
            />
            <FormControlLabel
              value="antibodyTest"
              control={<Radio />}
              label="Antibody Test"
              sx={{
                borderRadius: 4,
                bgcolor: 'primary.contrastText',
              }}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid
        item
        xs={4}
        sx={{
          borderRadius: 4,
          bgcolor: 'secondary.main',
          p: 5,
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          What was your test result?
        </Typography>
        <FormControl>
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
                bgcolor: 'primary.contrastText',
                mb: 2,
              }}
            />
            <FormControlLabel
              value="negative"
              control={<Radio />}
              label="Covid-19 Negative"
              sx={{
                borderRadius: 4,
                bgcolor: 'primary.contrastText',
                pr: 1,
              }}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={4}>
        <Button
          type="button"
          onClick={() => {
            addPatientTestResults();
            handleTestClose();
          }}
          variant="contained"
          sx={{
            mt: 2,
            width: 150,
          }}
          disabled={status}
        >
          Submit
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          type="button"
          onClick={() => {
            handleTestClose();
          }}
          color="warning"
          variant="contained"
          sx={{
            mt: 2,
            width: 150,
          }}
        >
          Cancel
        </Button>

      </Grid>
      {error && <Alert severity="error">{error}</Alert>}
    </Grid>
  );
}

export default UpdateTestResult;
