import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import useId from '@mui/material/utils/useId';
import { arrayUnion, doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, firestore } from '../../config/firebase_config';

type Props = {
    handleTestClose: any;
  };
function UpdateTestResult({ handleTestClose }: Props) {
  const [error, setError] = useState<string>('');
  const [testType, setTestType] = useState<string>('');
  const [testResult, setTestResult] = useState<string>('');

  const addPatientTestResults = async () => {
    const uid = auth.currentUser?.uid;
    const user = firestore.collection('users').doc(uid);
    await user.update({
      testsResults: arrayUnion({ testResult,
        testType }),
    });
  };

  return (
    <Grid
      container
      sx={{
        bgcolor: 'primary.contrastText',
        borderRadius: 2,
        boxShadow: 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 10,
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <Grid
          item
          xs={5}
          sx={{
            borderRadius: 4,
            bgcolor: 'secondary.main',
            p: 5,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
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
                  p: 1,
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
                  p: 1,
                  pr: 2,
                }}
              />
              <FormControlLabel
                value="antibodyTest"
                control={<Radio />}
                label="Antibody Test"
                sx={{
                  borderRadius: 4,
                  bgcolor: 'primary.contrastText',
                  mb: 2,
                  p: 1,
                }}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid
          item
          xs={5}
          sx={{
            borderRadius: 4,
            bgcolor: 'secondary.main',
            p: 5,
          }}
        >
          <Typography variant="h5" sx={{ mb: 2 }}>
            What was your result?
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
                  p: 1,
                }}
              />
              <FormControlLabel
                value="negative"
                control={<Radio />}
                label="Covid-19 Negative"
                sx={{
                  borderRadius: 4,
                  bgcolor: 'primary.contrastText',
                  mb: 2,
                  p: 1,
                  pr: 2,
                }}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid
        container
        xs={12}
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        <Grid item xs={2}>
          <Button
            type="button"
            onClick={() => {
              handleTestClose();
            }}
            color="warning"
            variant="contained"
            sx={{
              mt: 3,
              width: '100%',
            }}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            type="button"
            onClick={() => {
              handleTestClose();
              addPatientTestResults();
            }}
            variant="contained"
            sx={{
              mt: 3,
              width: '100%',
              ml: 2,
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UpdateTestResult;
