import * as React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import HeaderSymptoms from '../../components/formLayout/HeaderSymptoms';
import DrawerSymptoms from '../../components/formLayout/DrawerSymptoms';
import ResponseLayout from '../../components/formLayout/ResponseLayout';

export default function SymptomsForm() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('md'));
  const matches1 = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {matches && <HeaderSymptoms />}
          {!matches && <DrawerSymptoms />}

          <div
            style={{
              justifyContent: 'center',
              marginTop: matches ? 75 : 0,
              paddingTop: matches1 ? 95 : 0,
            }}
          >
            <ResponseLayout />
          </div>
        </Box>
      </div>
    </div>
  );
}
