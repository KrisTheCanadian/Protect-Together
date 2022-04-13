import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
} from '@mui/material';
import SideBar from '../../layout/SideBar';
import MedicalDashboard from './MedicalDashboard';
import PatientInfo from './PatientInfo/PatientInfo';
import ClosePatientFile from './PatientInfo/ClosePatientFile';
import AppointmentView from './appointmentView';

function MedicalView() {
  // contentId
  // medical dashboard: 0
  // patient's info: 1
  const [contentId, setContentId] = React.useState<number>(0);
  const [patientId, setPatientId] = React.useState<string>('');
  // modal content
  // appointments: 0
  // close patient's file: 1
  const [modalContent, setModalContent] = React.useState<number>(0);
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const viewPatient = ((PID: string) => {
    setPatientId(PID);
    setContentId(1);
  });

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

  const modalStyle = {
    borderRadius: '8px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    bgcolor: 'background.paper',
    border: 'none',
    boxShadow: 24,
    p: 4,
  };

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
          <ListItem
            button
            key="appointments"
            onClick={() => { setModalContent(0); handleOpen(); }}
          >
            <ListItemIcon>
              <DateRangeOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="View Appointments" />
          </ListItem>
          { contentId === 1 && (
          <ListItem
            button
            key="close"
            onClick={() => { setModalContent(1); handleOpen(); }}
          >
            <ListItemIcon>
              <CloseOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Close Patient's File" />
          </ListItem>
          ) }
        </List>
        <Divider />
      </SideBar>
      { contentId === 0 && <MedicalDashboard handlePatientClick={viewPatient} /> }
      { contentId === 1 && <PatientInfo PID={patientId} />}

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          {modalContent === 0 && <AppointmentView />}
          {modalContent === 1 && (
          <ClosePatientFile
            PID={patientId}
            handleClose={handleClose}
            goDashboard={setContentId}
          />
          )}
        </Box>
      </Modal>
    </Box>
  );
}
export default MedicalView;
