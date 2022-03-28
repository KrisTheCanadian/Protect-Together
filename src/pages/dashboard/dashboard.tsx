import { Box } from '@mui/material';
import React from 'react';
import { UserContext } from '../../context/UserContext';
import AdminDashboard from '../../components/dashboard/AdminDashboard';
import PatientView from '../../components/dashboard/PatientView';
import MedicalView from '../../components/dashboard/MedicalView';
import ThirdPartyDashboard from '../../components/dashboard/ThirdPartyView/ThirdPartyDashboard';

function Dashboard() {
  const { state, update } = React.useContext(UserContext);
  return (
    <Box sx={{ display: 'flex' }}>
      {state.role === 'admin' && <AdminDashboard />}
      {state.role === 'patient' && <PatientView />}
      {state.role === 'thirdParty' && <ThirdPartyDashboard />}
      {state.role === 'medical' && <MedicalView />}
    </Box>
  );
}

export default Dashboard;
