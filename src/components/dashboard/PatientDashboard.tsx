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
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import MainContent from '../layout/MainContent';
import SideBar from '../layout/SideBar';
import { UserContext } from '../../context/UserContext';
import AdminCreateAccount from '../../pages/auth/admincreateaccount';

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

function PatientDashboard() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpenQuiz = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const navigate = useNavigate();

  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Header title={`Welcome ${state.firstName}`} subtitle="Stay safe">
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
