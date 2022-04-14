import React, { useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
  Container,
  Grid,
} from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import SideBar from '../../layout/SideBar';
import { UserContext } from '../../../context/UserContext';
import SexChart from './SexChart';
import TestChart from './TestChart';
import AgeChart from './AgeChart';
import DoctorStateChart from './DoctorStateChart';
import Firebase, { firestore } from '../../../config/firebase_config';

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
const getAge = (birthDate: Date) => Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10);
function ThirdPartyDashboard() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [males, setMales] = React.useState(0);
  const [females, setFemales] = React.useState(0);
  const [thirds, setThirds] = React.useState(0);
  const [positiveCases, setPositiveCases] = React.useState(0);
  const [negativeCases, setNegativeCases] = React.useState(0);
  const [assignedDoctorStats, setAssignedDoctorStats] = React.useState({ assigned: 0, unassigned: 0 });
  const assignedDoctorStatsInitial = { assigned: 0, unassigned: 0 };

  const ageDataInitial = {
    underTwenty: 0,
    underFourty: 0,
    underSixty: 0,
    underEighty: 0,
    old: 0,
  };

  const [ageData, setAgeData] = React.useState(ageDataInitial);
  let maleSex = 0;
  let femaleSex = 0;
  let thirdSex = 0;

  let positiveResult = 0;
  let negativeResult = 0;

  const { state, update } = React.useContext(UserContext);

  const patientSexPopulate = (sex: any) => {
    if (sex === 'Male') {
      maleSex += 1;
    } else if (sex === 'Female') {
      femaleSex += 1;
    } else {
      thirdSex += 1;
    }
  };

  const agePopulate = (age: any) => {
    switch (true) {
      case (age < 20):
        ageDataInitial.underTwenty += 1;
        break;
      case (age < 40):
        ageDataInitial.underFourty += 1;
        break;
      case (age < 60):
        ageDataInitial.underSixty += 1;
        break;
      case (age < 80):
        ageDataInitial.underEighty += 1;
        break;
      case (age >= 80):
        ageDataInitial.old += 1;
        break;
      default:
      // code block
    }
  };

  const testResultsPopulate = (result: any) => {
    if (result === 'positive') {
      positiveResult += 1;
    } else {
      negativeResult += 1;
    }
  };

  const getAssignedStats = (patient: any) => {
    if (patient.doctorName) {
      assignedDoctorStatsInitial.assigned += 1;
    } else {
      assignedDoctorStatsInitial.unassigned += 1;
    }
  };

  const populateData = ({ data }: any) => {
    data.forEach((patient: any) => {
      patientSexPopulate(patient.sex);
      getAssignedStats(patient);
      // eslint-disable-next-line no-underscore-dangle
      const age = getAge(new Date(patient.dateOfBirth._seconds * 1000));
      agePopulate(age);
      if (!patient.testsResults) {
        testResultsPopulate('negative');
      } else {
        testResultsPopulate(patient.testsResults[patient.testsResults.length - 1].testResult);
      }
    });
    setAssignedDoctorStats({ ...assignedDoctorStatsInitial });
    setMales(maleSex);
    setFemales(femaleSex);
    setThirds(thirdSex);
    setAgeData({ ...ageDataInitial });
    setPositiveCases(positiveResult);
    setNegativeCases(negativeResult);
  };

  useEffect(() => {
    const getThirdPartyInfo = Firebase.functions().httpsCallable('getThirdPartyInfo');
    getThirdPartyInfo().then((data) => {
      console.log(data);
      populateData(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Header title={`Welcome ${state.lastName}`} subtitle="Track Covid Cases around Canada" />
      <SideBar>
        <List>
          <ListItem button key="Dashboard">
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      <MainContent>
        <Typography variant="h6" mb={4}>Check out some statistics on Protect Together&apos;s patients!</Typography>
        <Grid container spacing={10}>
          <Grid item xs={12} md={4}>
            <Box>
              <TestChart positiveCases={positiveCases} negativeCases={negativeCases} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <DoctorStateChart assigned={assignedDoctorStats.assigned} notAssigned={assignedDoctorStats.unassigned} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <SexChart maleSex={males} femaleSex={females} thirdSex={thirds} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box>
              <AgeChart {...ageData} />
            </Box>
          </Grid>
        </Grid>

      </MainContent>

    </Box>
  );
}
export default ThirdPartyDashboard;
