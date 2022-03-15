import React, { useState } from 'react';
import {
  Typography,
  Link,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';

export default function SymptomsUpdateResponse() {
  const theme = useTheme();
  const midSize = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper
      sx={{
        display: 'flex',
        padding: 4,
        justifyContent: 'center',
        width: midSize ? '100%' : '50%',
        margin: 'auto',
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Grid item>
          <Typography variant="h5" align="center">Your symptoms have been updated.</Typography>
        </Grid>
        <Grid item>
          <Link href="/dashboard" variant="h6" align="center">Go back to dashboard</Link>
        </Grid>
      </Grid>
    </Paper>
  );
}
