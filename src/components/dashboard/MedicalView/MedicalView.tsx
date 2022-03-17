import React from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SideBar from '../../layout/SideBar';
import MedicalDashboard from './MedicalDashboard';
import PatientInfo from './PatientInfo';

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

function MedicalView() {
  // contentId
  // medical dashboard: 0
  // patient's into: 1
  const [contentId, setContentId] = React.useState<number>(0);
  const [patientId, setPatientId] = React.useState<string>('');

  const viewPatient = ((PID: string) => {
    setPatientId(PID);
    setContentId(1);
  });

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <CssBaseline />
      <SideBar>
        <List>
          <ListItem
            button
            key="Dashboard"
            onClick={() => setContentId(0)}
          >
            <ListItemIcon>
              <DashboardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
        <Divider />
      </SideBar>
      { contentId === 0 && <MedicalDashboard handlePatientClick={viewPatient} /> }
      { contentId === 1 && <PatientInfo PID={patientId} />}

    </Box>
  );
}
export default MedicalView;
