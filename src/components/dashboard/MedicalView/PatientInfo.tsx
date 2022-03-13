import React from 'react';
import {
  Button,
  Box,
  Modal,
  Typography,
  Grid,
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

const buttonStyle = {
  marginLeft: '10px',
};

function MedicalDashboard() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const { state, update } = React.useContext(UserContext);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title="Welcome Omar Workman" subtitle="RAMQ OMAR987654321 Age: 76 years">
        <Button sx={buttonStyle} variant="contained" color="warning" onClick={handleOpen}>
          Close Patinet&apos;s File
        </Button>
        <Button sx={buttonStyle} variant="contained" color="info" onClick={handleOpen}>
          View Apointments
        </Button>
      </Header>
      <MainContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <Box sx={{ m: 2, p: 4, border: '1px solid grey', textAlign: 'center' }}>
              <Typography component="h1" variant="h4">
                Info 1
              </Typography>
            </Box>
            <Box sx={{ m: 2, p: 4, border: '1px solid grey', textAlign: 'center' }}>
              <Typography component="h1" variant="h4">
                Info 2
              </Typography>
            </Box>
            <Box sx={{ m: 2, p: 4, border: '1px solid grey', textAlign: 'center' }}>
              <Typography component="h1" variant="h4">
                Info 3
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Box sx={{ m: 2, p: 4, border: '1px solid grey', textAlign: 'center', height: '100%', verticalAlign: 'middle' }}>
              <Typography component="h1" variant="h4">
                Chat
              </Typography>
            </Box>
          </Grid>
        </Grid>
        {/* <MedicalTable />
        <Button sx={buttonStyle} variant="contained" color="info" onClick={handleOpen}>
          View Apointments
        </Button> */}
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
