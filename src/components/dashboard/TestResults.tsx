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
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import { auth, firestore } from '../../config/firebase_config';

type Props = {
  handleTestRClose: any;
};
function TestResults({ handleTestRClose }: Props) {
  const [status, setStatus] = useState<boolean>(true);

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
          <Paper elevation={20} sx={{ padding: '20px', maxWidth: '100%' }}>
            <Timeline>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  2022-03-10
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>PCR Test: Positive</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  2022-03-08
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>PCR Test: Negative</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  2022-03-06
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Antibody Test: Negative</TimelineContent>
              </TimelineItem>
              <TimelineItem>
                <TimelineOppositeContent color="text.secondary">
                  2022-03-05
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>Antibody Test: Negative</TimelineContent>
              </TimelineItem>
            </Timeline>
          </Paper>
        </Grid>

        <Grid
          item
          sx={{
            width: '100%',
          }}
        >
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
        </Grid>
      </Grid>
    </Grid>
  );
}

export default TestResults;
