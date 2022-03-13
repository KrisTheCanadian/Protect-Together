import { Box } from '@mui/material';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import PatientDashboard from '../../components/dashboard/PatientDashboard';
import MedicalDashboard from '../../components/dashboard/MedicalView';
import ThirdPartyDashboard from '../../components/dashboard/ThirdPartyDashboard';

function Dashboard() {
  const { state, update } = React.useContext(UserContext);
  return (
    <Box sx={{ display: 'flex' }}>
      {state.role === 'admin' && <AdminDashboard />}
      {state.role === 'patient' && <PatientDashboard />}
      {state.role === 'thirdParty' && <ThirdPartyDashboard />}
      {state.role === 'medical' && <MedicalDashboard />}
    </Box>
  );
}

export default Dashboard;
