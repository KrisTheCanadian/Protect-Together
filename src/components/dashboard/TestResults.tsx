import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { doc, Timestamp, onSnapshot } from 'firebase/firestore';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { UserContext } from '../../context/UserContext';
import { firestore } from '../../config/firebase_config';

type Props = {
  handleTestRClose: any;
};

interface TestResult {
  testDate: Timestamp;
  testResult: string;
  testType: string;
}

function TestResults({ handleTestRClose }: Props) {
  const { state } = React.useContext(UserContext);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();

      if (data && data.testsResults) {
        setTestResults(data.testsResults);
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Grid
      container
      sx={{
        bgcolor: 'background.default',
        borderRadius: 1,
        boxShadow: 3,
        padding: 6,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        width: '98%',
        m: '1%',
        maxHeight: '95vh',
        overflow: 'scroll',
      }}
    >
      <Grid
        item
        sx={{
          width: '100%',
        }}
      />
      <Paper sx={{ bgcolor: 'white', padding: '20px', maxWidth: '100%' }}>
        <Timeline>
          {testResults.map((testResult) => (
            <TimelineItem key={testResult.testDate.toString()}>
              <TimelineOppositeContent color="text.secondary">
                {testResult.testDate.toDate().toDateString()}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                {testResult.testType}
                :
                {' '}
                {testResult.testResult}
              </TimelineContent>
            </TimelineItem>

          ))}

        </Timeline>
      </Paper>
      <Grid item>
        <Paper
          sx={{
            mt: 2,
          }}
        >
          <Button
            type="button"
            onClick={() => {
              handleTestRClose();
            }}
            color="warning"
            fullWidth
            variant="contained"
          >
            Close
          </Button>
        </Paper>
      </Grid>
      <Grid item>
        <Paper
          sx={{
            mt: 2,
          }}
        />
      </Grid>
    </Grid>
  );
}

export default TestResults;
