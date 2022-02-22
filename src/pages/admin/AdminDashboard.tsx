import React from 'react';
import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import Header from '../../components/layout/Header';
import MainContent from '../../components/layout/MainContent';
import SideBar from '../../components/layout/SideBar';
import { UserContext } from '../../context/UserContext';

function AdminDashboard() {
  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header title="Welcome Dr. ">
        <Button variant="contained" color="info" sx={{ mr: 1 }}>
          primary
        </Button>
        <Button variant="contained" color="secondary">
          Secondary
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
    </Box>
  );
}
export default AdminDashboard;
