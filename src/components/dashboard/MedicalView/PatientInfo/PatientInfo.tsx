import React, { useEffect } from 'react';
import {
  Button,
  Box,
  Modal,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Divider,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ExpandLessOutlinedIcon from '@mui/icons-material/ExpandLessOutlined';
import Header from '../../../layout/Header';
import MainContent from '../../../layout/MainContent';
import PatientTimeline from './PatientTimeline';
import PatientInfoList from './PatientInfoList';
import { firestore } from '../../../../config/firebase_config';
import theme from '../../../../static/style/theme';
import NotificationsButton from '../../../layout/NotificationsButton';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { lg: '50%', md: '75%', sm: '100%', xs: '100%' },
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

type Symptoms = {
  date: Timestamp,
  userSymptoms: string[],
};

type TestResult = {
  testDate: Timestamp,
  testResult: string,
  testType: string,
};

type Events = {
  date: Timestamp,
  eventsList: string[],
};

type HelpFormData = {
  label: string,
  result: string,
}

type PatientData = {
  PID: string,
  name: string,
  age: number,
  sex: string,
  healthCardNumber: string,
  status: string,
  latestTestResult: TestResult | undefined,
  latestSymptoms: Symptoms | undefined,
  history: Events[] | undefined,
  medicalConditions: string | undefined,
  phone: string | undefined,
  bmi: number,
  score: number | undefined,
  initHelpFormData: HelpFormData[],
}

const initPatientData: PatientData = {
  PID: '',
  name: '',
  age: 0,
  sex: '',
  healthCardNumber: '',
  status: '',
  latestTestResult: undefined,
  latestSymptoms: undefined,
  history: undefined,
  medicalConditions: undefined,
  phone: undefined,
  bmi: 0,
  score: undefined,
  initHelpFormData: [],
};

export function caseSeverity(score: number | undefined): string {
  if (score !== undefined) {
    if (score > 2.5) return ('Severe');
    if (score >= 1.5 && score <= 2.5) return ('Moderate');
    return ('Mild');
  }
  return ('-');
}

function PatientInfo({ PID }: Props) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [patientData, setPatientData] = React.useState<PatientData>(initPatientData);
  const [modalContent, setModalContent] = React.useState<number>(0);
  const [expandInfo, setExpandInfo] = React.useState<boolean>(false);

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

  useEffect(() => {
    const unsubscribe = patientRef.onSnapshot(async (patientDataSnapshot: any) => {
      const patient = patientDataSnapshot.data();
      if (patient) {
        const patientId = patient.UID;
        const name = [patient.firstName, patient.lastName].join(' ');
        const age = Math.floor(((Date.now() - patient.dateOfBirth.toDate()) / 31536000000));
        const { sex, healthCardNumber, priority, medicalConditions, phone } = patient;
        const appointmentDate = format(new Date(1646707969351), 'Pp');
        const status = patient.testsResults !== undefined
          ? (patient.testsResults[patient.testsResults.length - 1]).testResult : '';
        const latestTestResult = patient.testsResults !== undefined
          ? patient.testsResults[patient.testsResults.length - 1] : undefined;
        const latestSymptoms = patient.patientSymptoms !== undefined
          ? patient.patientSymptoms[patient.patientSymptoms.length - 1] : undefined;
        const history: Events[] = [];
        if (patient.patientSymptoms !== undefined) {
          patient.patientSymptoms.forEach((elem: Symptoms) => (
            history.push({ date: elem.date, eventsList: elem.userSymptoms })
          ));
        }
        if (patient.testsResults !== undefined) {
          patient.testsResults.forEach((elem: TestResult) => (
            history.push({ date: elem.testDate, eventsList: [`Test: ${elem.testResult} (${elem.testType})`] })
          ));
        }
        history.sort((a: Events, b: Events) => b.date.seconds - a.date.seconds);
        const height = Number(patient.height);
        const weight = Number(patient.weight);
        const bmi = (4535.9237 * weight) / (height * height);
        const score = Number(patient.score);
        const initHelpFormData = patient.initialPatientHelpFormData;
        setPatientData({
          PID: patientId,
          name,
          age,
          sex,
          healthCardNumber,
          status,
          latestTestResult,
          latestSymptoms,
          history,
          medicalConditions,
          phone,
          bmi,
          score,
          initHelpFormData,
        });
      }
    });
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const extendedInfo = (): JSX.Element[] => {
    if (!expandInfo) {
      return ([
        <ListItem key="collapse" sx={{ margin: 0, padding: 0, justifyContent: 'center' }}>
          <IconButton
            size="small"
            aria-label="collapse"
            onClick={(event) => setExpandInfo(true)}
          >
            <ExpandMoreOutlinedIcon />
          </IconButton>
        </ListItem>,
      ]);
    }
    const helpForm: JSX.Element[] = [];
    patientData.initHelpFormData?.forEach((item: HelpFormData) => {
      helpForm.push(<Divider key={`${item.label}divider`} variant="middle" />);
      helpForm.push(
        <ListItem key={item.label}>
          <ListItemText primary={item.label} secondary={item.result} />
        </ListItem>,
      );
    });
    const elements: JSX.Element[] = [
      <Divider key="d1" variant="middle" />,
      <ListItem key="MedicalConditions">
        <ListItemText primary="Medical Conditions" secondary={patientData.medicalConditions} />
      </ListItem>,
      <Divider key="d2" variant="middle" />,
      <ListItem key="Age">
        <ListItemText primary="Age" secondary={patientData.age} />
      </ListItem>,
      <Divider key="d3" variant="middle" />,
      <ListItem key="Sex">
        <ListItemText primary="Sex" secondary={patientData.sex} />
      </ListItem>,
      <Divider key="d4" variant="middle" />,
      <ListItem key="BMI">
        <ListItemText primary="BMI" secondary={(Math.round(100 * patientData.bmi) / 100).toFixed(2)} />
      </ListItem>,
      <Divider key="d5" variant="middle" />,
      <ListItem key="HealthCard Number">
        <ListItemText primary="Health Card Number" secondary={patientData.healthCardNumber} />
      </ListItem>,
      <Divider key="d6" variant="middle" />,
      <ListItem key="PhoneNumber">
        <ListItemText primary="Phone Number" secondary={patientData.phone} />
      </ListItem>,
      <ListItem key="expand" sx={{ margin: 0, padding: 0, justifyContent: 'center' }}>
        <IconButton
          size="small"
          aria-label="expand"
          onClick={(event) => setExpandInfo(false)}
        >
          <ExpandLessOutlinedIcon />
        </IconButton>
      </ListItem>,
    ];
    return (helpForm.concat(elements));
  };

  return (
    <Box sx={{ display: 'flex', width: '100%', verticalAlign: 'middle' }}>
      <Header
        title={`${patientData.name}`}
        subtitle={`RAMQ ${patientData.healthCardNumber} Age: ${patientData.age} years`}
      >
        <NotificationsButton />
      </Header>
      <MainContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={3}>
            <Box sx={{ maxHeight: 'calc(100vh - 136px)', overflowY: 'auto' }}>
              <List
                dense
                sx={listStyle}
                subheader={(
                  <ListSubheader
                    sx={listHeaderStyle}
                  >
                    Patient&apos;s Info
                  </ListSubheader>
                )}
              >
                { patientData.latestTestResult && (
                <ListItem key="Latest Covid Test">
                  <ListItemText
                    primary="Latest Covid Test"
                    secondary={(
                      <Typography
                        style={
                          patientData.latestTestResult?.testResult === 'positive'
                            ? { color: theme.palette.warning.contrastText } : { color: theme.palette.info.main }
                        }
                      >
                        {`${patientData.latestTestResult?.testResult} (${patientData.latestTestResult?.testType})`}
                      </Typography>
                    )}
                  />
                </ListItem>
                )}
                <Divider variant="middle" />
                { patientData.score && (
                <ListItem key="Case Severity">
                  <ListItemText
                    primary="Case Severity"
                    secondary={(
                      <Typography
                        style={
                          // eslint-disable-next-line no-nested-ternary
                          caseSeverity(patientData.score) === 'Severe'
                            ? { color: theme.palette.warning.contrastText }
                            : (caseSeverity(patientData.score) === 'Mild'
                              ? { color: theme.palette.info.main } : { color: 'inherit' })
                        }
                      >
                        {caseSeverity(patientData.score)}
                      </Typography>
                    )}
                  />
                </ListItem>
                )}
                {extendedInfo && extendedInfo()}
              </List>
              <PatientInfoList
                listTitle="Latest Symptoms"
                listItems={patientData.latestSymptoms?.userSymptoms.map((elem) => ({ primary: elem, secondary: '' }))}
              />
              <Button sx={{ mt: '16px' }} fullWidth variant="contained" color="info" onClick={handleViewHistory}>
                History
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={9}>
            <Box>
              {/* chat goes here */}
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
          {modalContent === 0 && 'appointments'}
          {modalContent === 1 && 'appointments'}
          {modalContent === 2 && <PatientTimeline events={patientData.history} />}
        </Box>
      </Modal>
    </Box>
  );
}
export default PatientInfo;
