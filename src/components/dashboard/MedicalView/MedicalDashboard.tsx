import React from 'react';
import {
  Button,
  Box,
  Modal,
} from '@mui/material';
import Header from '../../layout/Header';
import MainContent from '../../layout/MainContent';
import { UserContext } from '../../../context/UserContext';
import MedicalTable from './MedicalTable/MedicalTable';

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

function MedicalDashboard() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title={`Welcome Dr. ${state.lastName}`} subtitle="Track and manage your patients">
        <Button variant="contained" color="info" onClick={handleOpen}>
          View Apointments
        </Button>
      </Header>
      <MainContent>
        <MedicalTable />
      </MainContent>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          apointments
        </Box>
      </Modal>
    </Box>
  );
}
export default MedicalDashboard;
