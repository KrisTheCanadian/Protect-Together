import React, { useState, useEffect, useContext } from 'react';
// eslint-disable-next-line import/no-unresolved
import '../../../static/style/CovidData.css';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Modal,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import BiotechIcon from '@mui/icons-material/Biotech';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import SettingsIcon from '@mui/icons-material/Settings';
import { UserContext } from '../../../context/UserContext';
import SideBar from '../../layout/SideBar';
import UpdateTestResult from './UpdateTestResult';
import TestResults from './TestResults';
import { firestore } from '../../../config/firebase_config';
import PatientDashboard from './PatientDashboard';
import PatientMedicalConnect from './PatientMedicalConnect';
import AccountSettings from './AccountSettings';
import BookingSystem from '../../../pages/booking/bookingSystem';
import PatientAppointments from './PatientAppointments';

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

function PatientView() {
  const [contentId, setContentId] = useState<number>(0);
  const navigate = useNavigate();
  const [testOpen, setTestOpen] = useState(false);
  const [testROpen, setTestROpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [appointmentsViewOpen, setAppointmentsViewOpen] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const handleTestOpen = () => setTestOpen(true);
  const handleTestClose = () => setTestOpen(false);
  const handleTestROpen = () => setTestROpen(true);
  const handleTestRClose = () => setTestROpen(false);
  const handleBookingClose = () => setBookingOpen(false);
  const handleAppointmentsViewClose = () => setAppointmentsViewOpen(false);
  const { state } = useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();
  const [disableBook, setDisableBook] = useState<boolean>(false);
  const areAssigned = user?.assignedDoctor !== undefined;

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
        setDisableBook(data.disableBook);
        if (data.appointments && data.appointments.length) {
          const appointmentData = data?.appointments[data.appointments.length - 1]?.selectedDate;
          const appointmentTime = appointmentData?.toDate();
          const currentDate = new Date();
          if (appointmentTime > currentDate) {
            setAppointment(true);
          }
        }
      }
    });
    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <SideBar>
        <List>
          <ListItem button key="Dashboard" onClick={() => setContentId(0)}>
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button key="Dashboard2">
            <ListItemIcon>
              <CoronavirusIcon />
            </ListItemIcon>
            <ListItemText data-testid="covidtest2" primary="Add Covid-19 Test" onClick={handleTestOpen} />
          </ListItem>
          <ListItem button key="Test">
            <ListItemIcon>
              <BiotechIcon />
            </ListItemIcon>
            <ListItemText data-testid="TestResults" primary="Test Results" onClick={handleTestROpen} />
          </ListItem>
          {areAssigned && (
            <ListItem button key="Results" data-testid="SymptomsUpdate2">
              <ListItemIcon>
                <ContentPasteIcon />
              </ListItemIcon>
              <ListItemText
                primary="Symptoms Update"
                onClick={() => { navigate('/symptomsUpdate'); }}
              />
            </ListItem>
          )}
          <ListItem button key="Settings" data-testid="MainSettings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Main Settings" onClick={() => { setContentId(2); }} />
          </ListItem>
          {!disableBook && areAssigned && (
            <ListItem button key="Booking">
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary="Book Appointment"
                onClick={() => setBookingOpen(true)}
              />
            </ListItem>
          )}
          {appointment && disableBook && (
            <ListItem button key="Appointments">
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary="Next Appointment"
                onClick={() => setAppointmentsViewOpen(true)}
              />
            </ListItem>
          )}
        </List>
        <Divider />
      </SideBar>
      {contentId === 0 && <PatientDashboard setContentId={setContentId} />}
      {contentId === 1 && <PatientMedicalConnect />}
      {contentId === 2 && <AccountSettings />}
      <Modal
        open={testOpen}
        onClose={handleTestClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <UpdateTestResult handleTestClose={handleTestClose} />
        </Box>
      </Modal>
      <Modal
        open={testROpen}
        onClose={handleTestRClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TestResults handleTestRClose={handleTestRClose} />
        </Box>
      </Modal>
      <Modal
        open={bookingOpen}
        onClose={handleBookingClose}
      >
        <Box sx={style}>
          <BookingSystem handleBookingClose={handleBookingClose} />
        </Box>
      </Modal>
      <Modal
        open={appointmentsViewOpen}
        onClose={handleAppointmentsViewClose}
      >
        <Box sx={modalStyle}>
          <PatientAppointments handleAppointmentsViewClose={handleAppointmentsViewClose} />
        </Box>
      </Modal>
    </Box>
  );
}

export default PatientView;
