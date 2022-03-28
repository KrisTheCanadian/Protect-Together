/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import BiotechIcon from '@mui/icons-material/Biotech';
// eslint-disable-next-line import/no-unresolved
import '../../static/style/CovidData.css';
import {
  Button,
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import Header from '../layout/Header';
import MainContent from '../layout/MainContent';
import SideBar from '../layout/SideBar';
import { UserContext } from '../../context/UserContext';
import { firestore } from '../../config/firebase_config';
import UpdateTestResult from '../dashboard/patienttestresult';
import TestResults from '../dashboard/TestResults';
import theme from '../../static/style/theme';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    padding: 0,
  },
  boxShadow: 0,
  margin: 0,
  p: 4,
};

function PatientChat() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state, update } = React.useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenQuiz = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [testOpen, setTestOpen] = useState(false);
  const [testROpen, setTestROpen] = useState(false);
  const handleTestOpen = () => setTestOpen(true);
  const handleTestClose = () => setTestOpen(false);
  const handleTestROpen = () => setTestROpen(true);
  const handleTestRClose = () => setTestROpen(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
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
      <Header title={`Chat with Dr. ${user?.doctorName}`}>
        <Button variant="contained" color="primary" onClick={() => { navigate('/symptomsUpdate'); }}>
          Update Your Symptoms
        </Button>
      </Header>
      <SideBar>
        <List>
          <ListItem button key="Dashboard">
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dashboard"
              onClick={() => { navigate('/dashboard'); }}
            />
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
          <ListItem button key="Results" data-testid="SymptomsUpdate2">
            <ListItemIcon>
              <ContentPasteIcon />
            </ListItemIcon>
            {user?.assignedDoctor && (
            <ListItemText
              primary="Symptoms Update"
              onClick={() => { navigate('/symptomsUpdate'); }}
            />
            )}
          </ListItem>

        </List>
        <Divider />
      </SideBar>
      <MainContent>
        Chat
      </MainContent>
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
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          quiz
        </Box>
      </Modal>
    </Box>
  );
}
export default PatientChat;
