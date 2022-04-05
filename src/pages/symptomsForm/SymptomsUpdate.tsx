import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import HeaderSymptoms from '../../components/formLayout/HeaderSymptoms';
import DrawerSymptoms from '../../components/formLayout/DrawerSymptoms';
import UpdateSymptomsLayout from '../../components/formLayout/UpdateSymptomsLayout';

export default function SymptomsForm() {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));
  const [status, setStatus] = useState('1');

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box data-testid="symptoms" sx={{ display: 'flex', justifyContent: 'center' }}>
          {matchesMd && <HeaderSymptoms id={status} content="updateForm" />}
          {!matchesMd && <DrawerSymptoms id={status} content="updateForm" />}

          <div
            data-testid="status"
            style={{
              justifyContent: 'center',
              marginTop: matchesMd ? 30 : 0,
              paddingTop: matchesSm ? 130 : 0,
            }}
          >
            <UpdateSymptomsLayout changeState={setStatus} />
          </div>
        </Box>
      </div>
    </div>
  );
}
