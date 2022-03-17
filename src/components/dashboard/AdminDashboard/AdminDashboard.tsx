import React, { useState } from 'react';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
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
import AdminCreateAccount from '../../../pages/auth/admincreateaccount';
import AdminTable from './AdminTable/AdminTable';
import theme from '../../../static/style/theme';
import PatientTable from './PatientTable';

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

function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('dashboard');
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Header title={`Welcome ${state.firstName}`} subtitle="Track and manage staff">
        <Button variant="contained" color="info" onClick={handleOpen}>
          Add Account
        </Button>
      </Header>
      <SideBar>
        <List>
          <ListItem button onClick={() => { setView('dashboard'); }}>
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => { setView('patientList'); }}>
            <ListItemIcon>
              <EmojiPeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Unassigned Patients" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      <MainContent>
        {view === 'dashboard' && <AdminTable />}
        {view === 'patientList' && <PatientTable />}
      </MainContent>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AdminCreateAccount handleClose={handleClose} />
        </Box>
      </Modal>
    </Box>
  );
}
export default AdminDashboard;
