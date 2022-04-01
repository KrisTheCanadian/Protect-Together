import React, { useState } from 'react';
import {
  Typography,
  Paper,
  Grid,
  Box,
  Container,
} from '@mui/material';

const styles = {
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default function SymptomsUpdateResponse() {
  return (
    <div style={{ display: 'flex' }}>
      <Box
        minHeight="95vh"
        width="100%"
        sx={{ flexGrow: 1 }}
        style={styles.centered}
      >
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              padding: 4,
              justifyContent: 'center',
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
                <Typography
                  variant="h5"
                  align="center"
                >
                  Your doctor has been notified of your symptoms&apos; update.
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>
    </div>
  );
}
