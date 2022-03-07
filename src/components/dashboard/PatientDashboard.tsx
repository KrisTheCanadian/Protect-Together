import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import MainContent from '../layout/MainContent';
import SideBar from '../layout/SideBar';
import { UserContext } from '../../context/UserContext';
import UpdateTestResult from './patienttestresult';
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

function PatientDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenQuiz = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();
  const [testOpen, setTestOpen] = useState(false);
  const handleTestOpen = () => setTestOpen(true);
  const handleTestClose = () => setTestOpen(false);

  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Header title={`Welcome ${state.firstName}`} subtitle="Stay safe">
        <Button variant="contained" color="info" sx={{ mr: 1 }} onClick={handleTestOpen}>
          Add Covid-19 Test
        </Button>
        <Button variant="contained" color="primary" onClick={() => { navigate('/symptomsForm'); }}>
          Ask for Help
        </Button>
      </Header>
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
export default PatientDashboard;
