import React from 'react';
import { Box } from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import { UserContext } from '../../../context/UserContext';
import MedicalTable from './MedicalTable/MedicalTable';
import NotificationsButton from '../../layout/NotificationsButton';

type Props = {
  handlePatientClick: any,
};

function MedicalDashboard({ handlePatientClick }: Props) {
  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%', overflowX: 'auto' }}>
      <Header title={`Welcome Dr. ${state.lastName}`} subtitle="Track and manage your patients">
        <NotificationsButton />
      </Header>
      <MainContent>
        <MedicalTable handlePatientClick={handlePatientClick} />
      </MainContent>
    </Box>
  );
}
export default MedicalDashboard;
