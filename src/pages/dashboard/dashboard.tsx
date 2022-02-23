import { Box } from '@mui/material';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import AdminDashboard from '../../components/dashboard/AdminDashboard';

function Dashboard() {
  const { state, update } = React.useContext(UserContext);
  return (
    <Box sx={{ display: 'flex' }}>
      {state.role === 'admin' && <AdminDashboard />}
      {state.role === 'patient' && <AdminDashboard />}
    </Box>
  );
}

export default Dashboard;
