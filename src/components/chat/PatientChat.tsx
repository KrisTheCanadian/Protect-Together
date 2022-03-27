/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { doc, DocumentData, onSnapshot } from 'firebase/firestore';
import Header from '../layout/Header';
import MainContent from '../layout/MainContent';
import SideBar from '../layout/SideBar';
import { UserContext } from '../../context/UserContext';
import { firestore } from '../../config/firebase_config';

function PatientChat() {
  const navigate = useNavigate();
  const { state, update } = React.useContext(UserContext);
  const [user, setUser] = useState<DocumentData>();

  useEffect(() => {
    onSnapshot(doc(firestore, 'users', `${state.id}`), (docu) => {
      const data = docu.data();
      if (data) {
        setUser(data);
      }
    });

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
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      <MainContent>
        Chat
      </MainContent>
    </Box>
  );
}
export default PatientChat;
