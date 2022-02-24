import * as React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import HeaderSymptoms from '../../../components/formLayout/HeaderSymptoms';
import DrawerSymptoms from '../../../components/formLayout/DrawerSymptoms';
import FormLayout from '../../../components/formLayout/FormLayout';

export default function SymptomsForm() {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down('md'));
  const matchesSm = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          {matchesMd && <HeaderSymptoms />}
          {!matchesMd && <DrawerSymptoms />}

          <div
            style={{
              justifyContent: 'center',
              marginTop: matchesMd ? 20 : 0,
              paddingTop: matchesSm ? 50 : 0,
            }}
          >
            <FormLayout />
          </div>
        </Box>
      </div>
    </div>
  );
}
