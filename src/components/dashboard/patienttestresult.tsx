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
        padding: 6,
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Grid
        container
        item
        xs={12}
        rowSpacing={1.5}
        sx={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            width: '75%',
          }}
        >
          <Paper
            sx={{
              borderRadius: 4,
              bgcolor: 'secondary.main',
              p: 4,
            }}
          >
            <FormLabel
              sx={{
                fontSize: 20,
                mb: 2,
              }}
            >
              When did you take your test?
            </FormLabel>
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
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            width: '75%',
          }}
        >
          <Paper
            sx={{
              borderRadius: 4,
              bgcolor: 'secondary.main',
              p: 4,
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  fontSize: 20,
                }}
                focused={false}
              >
                Which test did you take?
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
                    borderRadius: 4,
                    bgcolor: 'primary.contrastText',
                    mb: 2,
                    mt: 2,
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
          </Paper>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            width: '75%',
          }}
        >
          <Paper
            sx={{
              borderRadius: 4,
              bgcolor: 'secondary.main',
              p: 4,
              mb: 2,
            }}
          >
            <FormLabel
              sx={{
                fontSize: 20,
              }}
            >
              What was your test result?
            </FormLabel>
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
                    mt: 2,
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
          </Paper>
        </Grid>
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
        <Grid item xs={4}>
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
        <Grid item xs={4}>
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
  );
}

export default UpdateTestResult;
