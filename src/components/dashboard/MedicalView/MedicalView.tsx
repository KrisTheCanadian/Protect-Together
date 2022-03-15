import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import {
  Button,
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Modal,
} from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import SideBar from '../../layout/SideBar';
import { UserContext } from '../../../context/UserContext';
import MedicalTable from './MedicalTable/MedicalTable';
import MedicalDashboard from './MedicalDashboard';
import PatientInfo from './PatientInfo';

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

function MedicalView() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { state, update } = React.useContext(UserContext);

  // contentId
  // medical dashboard: 0
  // patient's into: 1
  const [contentId, setContentId] = React.useState<number>(0);
  const [patientId, setPatientId] = React.useState<string>('');

  const viewPatient = ((PID: string) => {
    setPatientId(PID);
    setContentId(1);
  });

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <SideBar>
        <List>
          <ListItem
            button
            key="Dashboard"
            onClick={() => setContentId(0)}
          >
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      {/* <Header title={`Welcome Dr. ${state.lastName}`} subtitle="Track and manage your patients">
        <Button variant="contained" color="info" onClick={handleOpen}>
          View Apointments
        </Button>
      </Header>
      <MainContent>
        <MedicalTable />
      </MainContent> */}

      {/* <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          apointments
        </Box>
      </Modal> */}

      { contentId === 0 && <MedicalDashboard handlePatientClick={viewPatient} /> }
      { contentId === 1 && <PatientInfo PID={patientId} />}

    </Box>
  );
}
export default MedicalView;
