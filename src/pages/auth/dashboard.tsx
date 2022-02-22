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
import * as React from 'react';
import Header from '../../components/layout/Header';
import MainContent from '../../components/layout/MainContent';
import SideBar from '../../components/layout/SideBar';
import AdminDashboard from '../admin/AdminDashboard';

function Dashboard() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminDashboard />
    </Box>
  );
}

export default Dashboard;
