import React, { useEffect } from 'react';
import {
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
import { format } from 'date-fns';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import { UserContext } from '../../../context/UserContext';
import MedicalTable from './MedicalTable/MedicalTable';
import { firestore } from '../../../config/firebase_config';
import theme from '../../../static/style/theme';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  boxShadow: 0,
  margin: 0,
  p: 4,
};

const listHeaderStyle = {
  backgroundColor: '#E6E6E6',
  color: 'black',
  fontWeight: 'bold',
  marginTop: '16px',
};

const listStyle = {
  backgroundColor: 'white',
};

const headerButtonStyle = {
  marginLeft: '10px',
};

type Props = {
  PID: string,
};

type PatientData = {
  PID: string;
  name: string;
  age: number;
  sex: string;
  healthCardNumber: string;
  status: string;
  symptoms: string;
}

const initPatientData: PatientData = {
  PID: '',
  name: '',
  age: 0,
  sex: '',
  healthCardNumber: '',
  status: '',
  symptoms: '',
};

function MedicalDashboard({ PID } : Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [patientPriority, setPatientPriority] = React.useState<number>(5);
  const [patientData, setPatientData] = React.useState<PatientData>(initPatientData);
  const [modalContent, setModalContent] = React.useState<number>(0);

  const { state, update } = React.useContext(UserContext);

  const patientRef = firestore.collection('users').doc(PID);

  const handleCloseFile = () => {
    setModalContent(0);
    handleOpen();
  };

  const handleViewAppointments = () => {
    setModalContent(1);
    handleOpen();
  };

  const handleViewHistory = () => {
    setModalContent(2);
    handleOpen();
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

  useEffect(() => {
    const fetchData = async () => {
      const patientDataSnapshot = await patientRef.get();
      const patient = patientDataSnapshot.data();
      if (patient) {
        const patientId = patient.UID;
        const name = [patient.firstName, patient.lastName].join(' ');
        const age = Math.floor(((Date.now() - patient.dateOfBirth.toDate()) / 31536000000));
        const { sex } = patient;
        const { healthCardNumber } = patient;
        const appointmentDate = format(new Date(1646707969351), 'Pp');
        // eslint-disable-next-line max-len
        const status = patient.testsResults !== undefined ? (patient.testsResults[patient.testsResults.length - 1]).testResult : '';
        const symptoms = 'Severe fever';
        const { priority } = patient;
        if (priority) setPatientPriority(Number(priority));
        setPatientData({ PID: patientId, name, age, sex, healthCardNumber, status, symptoms });
        if (patient.hasUpdates === undefined || patient.hasUpdates) {
          // await patientRef.update({ hasUpdates: false });
        }
      }
    };
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
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
              Close Patinet&apos;s File
            </Button>
          </Grid>
          <Grid item md={4} sm={12}>
            <Button sx={headerButtonStyle} variant="contained" color="info" onClick={handleViewAppointments}>
              View Apointments
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
          { modalContent === 0 && 'apointments'}
          { modalContent === 1 && 'apointments'}
          { modalContent === 2 && timeline}
        </Box>
      </Modal>
    </Box>
  );
}
export default MedicalDashboard;
