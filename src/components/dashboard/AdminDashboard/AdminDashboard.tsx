import React, { useState, useEffect } from 'react';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Badge,
} from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import SideBar from '../../layout/SideBar';
import { UserContext } from '../../../context/UserContext';
import AdminCreateAccount from '../../../pages/auth/admincreateaccount';
import AdminTable from './AdminTable/AdminTable';
import theme from '../../../static/style/theme';
import UnassignedPatientTable from './UnassignedPatientTable';
import NotificationsMenuItem from '../../layout/NotificationsMenuItem';
import Firebase, { firestore } from '../../../config/firebase_config';
import NotificationsButton from '../../layout/NotificationsButton';

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

interface UnassignedPatientTableData {
  name: string,
  score: number,
  UID: string,
}

function createData(
  name: string,
  score: number,
  UID: string,

) {
  return { name, score, UID };
}

function AdminDashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState('dashboard');
  const [nbUnassignedPatients, setNbUnassignedPatients] = useState<number>(0);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  const [rows, setRows] = useState<UnassignedPatientTableData[]>([]);

  const usersRef = firestore.collection('users').where('role', '==', 'patient')
    .where('assignedDoctor', '==', 'requestedDoctor');

  const { state, update } = React.useContext(UserContext);

  const handleNotifyTest = () => {
    const dispatchDoctor = Firebase.functions().httpsCallable('sendNotification');
    dispatchDoctor({ title: 'Title Test', message: 'testing', userId: state.id });
  };

  useEffect(() => {
    const unsubscribe = usersRef.onSnapshot(async (snapshot) => {
      let tableData = new Array<UnassignedPatientTableData>();
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.data();
        const name = `${user.firstName} ${user.lastName}`;
        const newRow = createData(name, user.score, user.UID);
        tableData = [newRow, ...tableData];
      });
      setRows(tableData);
      setNbUnassignedPatients(tableData.length);
    });

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <Header title={`Welcome ${state.firstName}`} subtitle="Track and manage staff">
        <NotificationsButton />
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
              <Badge badgeContent={nbUnassignedPatients} color="error">
                <EmojiPeopleIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Unassigned Patients" />
          </ListItem>
          <ListItem button onClick={handleOpen}>
            <ListItemIcon>
              <PersonAddIcon />
            </ListItemIcon>
            <ListItemText primary="Add Account" />
          </ListItem>
          <NotificationsMenuItem />
          <ListItem button onClick={handleNotifyTest}>
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Notify Test" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      <MainContent>
        {view === 'dashboard' && <AdminTable />}
        {view === 'patientList' && <UnassignedPatientTable rows={rows} />}
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
