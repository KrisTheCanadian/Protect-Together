import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { doc, Timestamp, onSnapshot } from 'firebase/firestore';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { UserContext } from '../../../context/UserContext';
import { firestore } from '../../../config/firebase_config';

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
  const theme = useTheme();
  const phoneSize = useMediaQuery(theme.breakpoints.down('sm'));

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

  if (testResults.length === 0) {
    return (
      <Paper sx={{ padding: '20px' }}>
        <Typography variant="h6" textAlign="center">You do not have any test results.</Typography>
      </Paper>
    );
  }
  return (
    <Paper sx={{ bgcolor: 'white', padding: '20px', maxWidth: '100%', maxHeight: '80vh', overflow: 'auto' }}>
      <Timeline>
        {testResults.map((x) => x).sort((a: TestResult, b: TestResult) => b.testDate.seconds - a.testDate.seconds)
          .map((testResult) => (
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
  );
}

export default TestResults;
