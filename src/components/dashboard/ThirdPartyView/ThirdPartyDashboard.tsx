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
} from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import SideBar from '../../layout/SideBar';
import { UserContext } from '../../../context/UserContext';
import SexChart from './SexChart';
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

function ThirdPartyDashboard() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [males, setMales] = React.useState(0);
  const [females, setFemales] = React.useState(0);
  const [thirds, setThirds] = React.useState(0);
  let maleSex = 0;
  let femaleSex = 0;
  let thirdSex = 0;

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

  const getData = ({ data }:any) => {
    data.forEach((dataObj: any) => {
      patientSexPopulate(dataObj.sex);
    });
    setMales(maleSex);
    setFemales(femaleSex);
    setThirds(thirdSex);
  };

  useEffect(() => {
    const getThirdPartyInfo = Firebase.functions().httpsCallable('getThirdPartyInfo');
    getThirdPartyInfo().then((data) => {
      console.log(data);
      getData(data);
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
        <Typography paragraph>{state.firstName}</Typography>
        <Box sx={{ width: '500px' }}>
          <SexChart maleSex={males} femaleSex={females} thirdSex={thirds} />
        </Box>
      </MainContent>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h1>ThirdParty Dashboard</h1>
        </Box>
      </Modal>
    </Box>
  );
}
export default ThirdPartyDashboard;
