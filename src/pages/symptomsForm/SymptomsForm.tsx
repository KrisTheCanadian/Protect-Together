import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import HeaderSymptoms from '../../components/formLayout/HeaderSymptoms';
import DrawerSymptoms from '../../components/formLayout/DrawerSymptoms';
import FormLayout from '../../components/formLayout/FormLayout';

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
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {matchesMd && <HeaderSymptoms id={status} />}
          {!matchesMd && <DrawerSymptoms id={status} />}

          <div
            style={{
              justifyContent: 'center',
              marginTop: matchesMd ? 30 : 0,
              paddingTop: matchesSm ? 130 : 0,
            }}
          >
            <FormLayout changeState={setStatus} />
          </div>
        </Box>
      </div>
    </div>
  );
}
