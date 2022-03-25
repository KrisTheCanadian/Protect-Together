import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Button,
  Box,
  Modal,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  Paper,
} from '@mui/material';
import { arrayUnion, doc, setDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import { auth, firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';

type Props = {
  handleTestRClose: any;
};

const timeline = (
  <Paper elevation={20} sx={{ bgcolor: 'white', padding: '20px', minWidth: '800px' }}>
    <Timeline>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          2022-03-10 09:30 am
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Test: Positive</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          2022-03-08 11:05 pm
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Fatigue</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          2022-03-06 10:20 1m
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Fever</TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          2022-03-05 03:05 pm
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>Caugh</TimelineContent>
      </TimelineItem>
    </Timeline>
  </Paper>
);

interface TestResult {
  testDate: Date
  testResult: string;
  testType: string;
}

function TestResults({ handleTestRClose }: Props) {
  const [status, setStatus] = useState<boolean>(true);

  const { state, update } = React.useContext(UserContext);
  const [notifications, setNotifications] = useState<TestResult[]>([]);

  useEffect(() => {
    onSnapshot(doc(firestore, 'users', ${state.id}), (docu) => {
      const data = docu.data();
      if (data && data.notifications) {
        setNotifications(data.notifications);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <Box sx={{ display: 'flex', width: '100%', verticalAlign: 'middle' }}>
      <Header
        title={`${patientData.name}`}
        subtitle={`RAMQ ${patientData.healthCardNumber} Age: ${patientData.age} years`}
      >
        <Grid
          container
          textAlign="right"
          spacing={1}
          sx={{ width: { md: '520px', sm: '200px' } }}
        >
          <Grid textAlign="left" item md={4} sm={12}>
            <FormControl fullWidth>
              <InputLabel id="patient-priority-label">Priority</InputLabel>
              <Select
                labelId="patient-priority-label"
                id="patient-priority"
                value={patientPriority}
                label="Priority"
                onChange={(event) => setPatientPriority(Number(event.target.value))}
              >
                <MenuItem value={10}>10 - Highest</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={1}>1 - Lowest</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={4} sm={12}>
            <Button sx={headerButtonStyle} variant="contained" color="warning" onClick={handleCloseFile}>
              Close Patient&apos;s File
            </Button>
          </Grid>
          <Grid item md={4} sm={12}>
            <Button sx={headerButtonStyle} variant="contained" color="info" onClick={handleViewAppointments}>
              View Appointments
            </Button>
          </Grid>
        </Grid>
      </Header>
      <MainContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={3}>
            <List
              sx={listStyle}
              subheader={(
                <ListSubheader
                  sx={listHeaderStyle}
                >
                  Vaccine Info
                </ListSubheader>
              )}
            >
              <ListItem>
                <ListItemText primary="Pfizer" secondary="Feb 9, 2022" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Pfizer" secondary="May 21, 2021" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Pfizer" secondary="Jan 3, 2021" />
              </ListItem>
            </List>
            <List
              sx={listStyle}
              subheader={(
                <ListSubheader
                  sx={listHeaderStyle}
                >
                  Risk Factors
                </ListSubheader>
              )}
            >
              <ListItem>
                <ListItemText primary="> 30 years" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="High BMI" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Diabetes" />
              </ListItem>
            </List>
            <List
              sx={listStyle}
              subheader={(
                <ListSubheader
                  sx={listHeaderStyle}
                >
                  Symptoms
                </ListSubheader>
              )}
            >
              <ListItem>
                <ListItemText primary="Congestion" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Cough" />
              </ListItem>
              <Divider variant="middle" />
              <ListItem>
                <ListItemText primary="Sore throat" />
              </ListItem>
            </List>
            <Button sx={{ mt: '16px' }} fullWidth variant="contained" color="info" onClick={handleViewHistory}>
              History
            </Button>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Box>
              {/* <Typography component="h1" variant="h4">
                Box
              </Typography> */}
            </Box>
          </Grid>
        </Grid>
      </MainContent>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          { modalContent === 0 && 'appointments'}
          { modalContent === 1 && 'appointments'}
          { modalContent === 2 && timeline}
        </Box>
      </Modal>
    </Box>
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
  );
}

export default TestResults;
