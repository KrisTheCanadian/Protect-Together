import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, Modal,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import BiotechIcon from '@mui/icons-material/Biotech';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import SettingsIcon from '@mui/icons-material/Settings';
import SideBar from '../../components/layout/SideBar';
import { firestore } from '../../config/firebase_config';
import { UserContext } from '../../context/UserContext';
import UpdateTestResult from '../../components/dashboard/PatientView/UpdateTestResult';
import TestResults from '../../components/dashboard/PatientView/TestResults';
import AccountSettings from '../../components/accountSettings/AccountSettings';
import PatientDashboard from '../../components/dashboard/PatientView/PatientDashboard';
import ContactInformation from '../../components/accountSettings/ContactInformation';
import HealthInformation from '../../components/accountSettings/HealthInfotmation';
import ChangePassword from '../../components/accountSettings/ChangePassword';
import AllInOne from '../../components/accountSettings/AllInOne';

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

function MainSettings() {
  const navigate = useNavigate();
  const [option, setOption] = useState<number>(0);
  const [testOpen, setTestOpen] = useState(false);
  const [testROpen, setTestROpen] = useState(false);
  const handleTestOpen = () => setTestOpen(true);
  const handleTestClose = () => setTestOpen(false);
  const handleTestROpen = () => setTestROpen(true);
  const handleTestRClose = () => setTestROpen(false);
  const { state } = useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();

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
      <SideBar>
        <List>
          <ListItem button key="Dashboard" onClick={() => { navigate('/dashboard'); }}>
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
          {user?.assignedDoctor && (
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
          <ListItem button key="Settings" data-testid="MainSettings" onClick={() => setOption(0)}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Main Settings" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      {option === 0 && <AllInOne setOption={setOption} />}
      {option === 1 && <AccountSettings setOption={setOption} />}
      {option === 1 && <ContactInformation />}
      {option === 2 && <ChangePassword />}
      {option === 3 && <HealthInformation />}

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
    </Box>
  );
}

export default MainSettings;
